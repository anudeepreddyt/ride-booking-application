
import { useEffect, useRef, useState } from 'react';
import { MapPin, Route, Settings2 } from 'lucide-react';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsPromise;


function loadGoogleMaps() {
    if (window.google?.maps?.importLibrary) {
        return Promise.resolve(window.google.maps);
    }

    if (!apiKey) {
        return Promise.reject(
            new Error('Google Maps API key is not configured.')
        );
    }

    if (!googleMapsPromise) {
        googleMapsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');

            // Google's dynamic library bootstrap loader.
            const callbackName = '__wayfareMapsLoaded';

            window[callbackName] = () => {
                if (window.google?.maps?.importLibrary) {
                    resolve(window.google.maps);
                } else {
                    googleMapsPromise = null;
                    reject(
                        new Error(
                            'Google Maps loaded without importLibrary. Remove any other Google Maps script from index.html.'
                        )
                    );
                }

                delete window[callbackName];
            };

            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly&callback=${callbackName}`;

            script.async = true;
            script.onerror = () => {
                googleMapsPromise = null;
                delete window[callbackName];

                reject(
                    new Error(
                        'Google Maps failed to load. Check your API key, billing, and API restrictions.'
                    )
                );
            };

            document.head.appendChild(script);
        });
    }

    return googleMapsPromise;
}


export default function MapPanel({
                                     pickup,
                                     destination,
                                     onSelect,
                                     selectedLocation = 'pickup',
                                     onRouteChange,
                                     onMapReady,
                                 }) {
    const mapElement = useRef(null);
    const mapRef = useRef(null);

    const activeLocationRef = useRef(selectedLocation);
    const onSelectRef = useRef(onSelect);
    const onRouteChangeRef = useRef(onRouteChange);
    const onMapReadyRef = useRef(onMapReady);

    const polylinesRef = useRef([]);
    const requestIdRef = useRef(0);

    const [mapsReady, setMapsReady] = useState(false);
    const [mapError, setMapError] = useState('');
    const [routeError, setRouteError] = useState('');

    useEffect(() => {
        activeLocationRef.current = selectedLocation;
    }, [selectedLocation]);

    useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    useEffect(() => {
        onRouteChangeRef.current = onRouteChange;
    }, [onRouteChange]);

    useEffect(() => {
        onMapReadyRef.current = onMapReady;
    }, [onMapReady]);

    // Initialize the map exactly once.
    useEffect(() => {
        let cancelled = false;
        let clickListener;

        async function initializeMap() {
            try {
                const maps = await loadGoogleMaps();

                if (cancelled || !mapElement.current) return;

                // Load the Maps JavaScript API library explicitly.
                const { Map } = await maps.importLibrary('maps');

                if (cancelled || !mapElement.current) return;

                const map = new Map(mapElement.current, {
                    center: { lat: 16.5062, lng: 80.648 },
                    zoom: 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                });

                mapRef.current = map;

                clickListener = map.addListener('click', (event) => {
                    if (!event.latLng) return;

                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();

                    onSelectRef.current?.(
                        {
                            lat,
                            lng,
                            address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                        },
                        activeLocationRef.current
                    );
                });

                setMapError('');
                setMapsReady(true);
                onMapReadyRef.current?.();
            } catch (error) {
                if (!cancelled) {
                    setMapError(
                        error.message ||
                        'Unable to initialize Google Maps.'
                    );

                    console.error(
                        'Google Maps initialization failed:',
                        error
                    );
                }
            }
        }

        initializeMap();

        return () => {
            cancelled = true;
            clickListener?.remove();

            polylinesRef.current.forEach((line) => line.setMap(null));
            polylinesRef.current = [];
            mapRef.current = null;
        };
    }, []);

    // Calculate the driving route when either location changes.
    useEffect(() => {
        const maps = window.google?.maps;
        const map = mapRef.current;

        if (!mapsReady || !maps || !map || !pickup || !destination) {
            return;
        }

        const origin = {
            lat: Number(pickup.lat),
            lng: Number(pickup.lng),
        };

        const drop = {
            lat: Number(destination.lat),
            lng: Number(destination.lng),
        };

        if (
            !Number.isFinite(origin.lat) ||
            !Number.isFinite(origin.lng) ||
            !Number.isFinite(drop.lat) ||
            !Number.isFinite(drop.lng) ||
            Math.abs(origin.lat) > 90 ||
            Math.abs(drop.lat) > 90 ||
            Math.abs(origin.lng) > 180 ||
            Math.abs(drop.lng) > 180
        ) {
            setRouteError(
                'Select valid pickup and destination coordinates.'
            );
            return;
        }

        let cancelled = false;
        const requestId = ++requestIdRef.current;

        polylinesRef.current.forEach((line) => line.setMap(null));
        polylinesRef.current = [];

        setRouteError('');

        async function calculateRoute() {
            try {
                // Load the modern Routes library.
                const { Route: GoogleRoute } =
                    await maps.importLibrary('routes');

                const result = await GoogleRoute.computeRoutes({
                    origin,
                    destination: drop,
                    travelMode: 'DRIVING',
                    fields: [
                        'path',
                        'distanceMeters',
                        'durationMillis',
                    ],
                });

                if (cancelled || requestId !== requestIdRef.current) {
                    return;
                }

                const route = result.routes?.[0];

                if (
                    !route ||
                    !Number.isFinite(route.distanceMeters) ||
                    !Number.isFinite(route.durationMillis) ||
                    !route.path?.length
                ) {
                    throw new Error(
                        'No valid driving route was returned for these locations.'
                    );
                }

                const distanceKm = route.distanceMeters / 1000;

                const durationMinutes = Math.ceil(
                    route.durationMillis / 60000
                );

                // Draw the route.
                const lines = route.createPolylines();

                if (cancelled || requestId !== requestIdRef.current) {
                    lines.forEach((line) => line.setMap(null));
                    return;
                }

                polylinesRef.current = lines;

                lines.forEach((line) => line.setMap(map));

                // Fit the map to the route.
                const { LatLngBounds } =
                    await maps.importLibrary('core');

                if (cancelled || requestId !== requestIdRef.current) {
                    lines.forEach((line) => line.setMap(null));
                    return;
                }

                const bounds = new LatLngBounds();

                route.path.forEach((point) => bounds.extend(point));

                map.fitBounds(bounds);

                // Send route metrics to App.jsx.
                onRouteChangeRef.current?.({
                    distanceKm,
                    durationMinutes,
                });
            } catch (error) {
                if (cancelled || requestId !== requestIdRef.current) {
                    return;
                }

                console.error('Driving route calculation failed:', error);

                setRouteError(
                    error.message ||
                    'Could not calculate the driving route. Check your Google Maps API settings.'
                );
            }
        }

        calculateRoute();

        return () => {
            cancelled = true;

            polylinesRef.current.forEach((line) => line.setMap(null));
            polylinesRef.current = [];
        };
    }, [
        mapsReady,
        pickup?.lat,
        pickup?.lng,
        destination?.lat,
        destination?.lng,
    ]);

    if (mapError) {
        return (
            <div className="map-fallback">
                <div className="fallback-icon">
                    <MapPin size={25} />
                </div>

                <h3>Map setup needed</h3>
                <p>{mapError}</p>

                <p className="muted">
                    Check your API key, billing, and enabled APIs.
                </p>

                <div className="map-config">
                    <Settings2 size={16} />
                    VITE_GOOGLE_MAPS_API_KEY
                </div>
            </div>
        );
    }

    return (
        <div className="map-wrap">
            <div ref={mapElement} className="google-map" />

            <div className="map-hint">
                <Route size={15} />

                {selectedLocation === 'destination'
                    ? 'Click the map to change your destination.'
                    : 'Click the map to change your pickup location.'}
            </div>

            {routeError && (
                <p className="error-box" role="alert">
                    Route error: {routeError}
                </p>
            )}
        </div>
    );
}
