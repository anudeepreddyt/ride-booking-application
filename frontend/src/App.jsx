
import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Clock3,
  Compass,
  CreditCard,
  History,
  LogOut,
  MapPin,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { api, getUser, logout, saveSession } from './api';
import MapPanel from './MapPanel';

const money = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

function Header({ user, onLogout }) {
  return (
      <header className="header">
        <Link to="/" className="brand">
        <span className="brand-mark">
          <CarFront size={21} />
        </span>
          wayfare<span className="brand-dot">.</span>
        </Link>

        <nav>
          <a href="/#how-it-works">How it works</a>
          <a href="/#services">Ride options</a>
          {user ? (
              <Link
                  to={
                    user.role === 'DRIVER'
                        ? '/driver'
                        : user.role === 'ADMIN'
                            ? '/admin'
                            : '/book'
                  }
              >
                Dashboard
              </Link>
          ) : (
              <Link to="/login">Sign in</Link>
          )}
        </nav>

        <div className="header-right">
          {user ? (
              <>
            <span className="user-chip">
              {user.name.split(' ')[0]}
            </span>
                <button
                    className="button button-dark button-small"
                    onClick={onLogout}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
          ) : (
              <Link
                  className="button button-dark button-small"
                  to="/register"
              >
                Get started <ArrowRight size={15} />
              </Link>
          )}
        </div>
      </header>
  );
}

function Landing() {
  return (
      <>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> YOUR CITY, YOUR WAY
            </div>

            <h1>
              Your ride,
              <br />
              just a few clicks <em>away.</em>
            </h1>

            <p className="hero-sub">
              A better way to get there. Reliable rides, upfront pricing,
              and a little more peace of mind in every mile.
            </p>

            <div className="hero-actions">
              <Link className="button button-primary" to="/register">
                Book your first ride <ArrowRight size={17} />
              </Link>
              <a className="text-link" href="#how-it-works">
                See how it works <ArrowRight size={15} />
              </a>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack">
                <span>A</span>
                <span>R</span>
                <span>M</span>
                <span>+</span>
              </div>
              <div>
                <strong>Made for everyday journeys</strong>
                <small>Simple booking. Clear fares. Safer rides.</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-grid" />

            <div className="route-card">
              <div className="route-top">
                <span className="live-dot" /> YOUR RIDE AT A GLANCE
                <span className="route-time">~ 12 min</span>
              </div>

              <div className="route-path">
                <div className="route-node">
                  <span className="node-dot pickup-dot" />
                  <div>
                    <small>PICKUP</small>
                    <strong>Near you</strong>
                  </div>
                </div>

                <div className="route-line" />

                <div className="route-node">
                  <span className="node-dot drop-dot" />
                  <div>
                    <small>DESTINATION</small>
                    <strong>Where you're headed</strong>
                  </div>
                </div>
              </div>

              <div className="route-bottom">
                <div>
                  <small>ESTIMATED FROM</small>
                  <strong>₹120</strong>
                </div>
                <div className="mini-car">
                  <CarFront size={31} />
                </div>
              </div>
            </div>

            <div className="visual-stamp">
              <Compass size={18} />
              <span>
              Go places.
              <br />
              <b>Feel good.</b>
            </span>
            </div>

            <div className="visual-caption">
              Designed around you <span>✳</span> Built for the everyday
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div>
            <ShieldCheck size={19} />
            <span>Safety comes first</span>
          </div>
          <div>
            <Wallet size={19} />
            <span>Upfront fare estimates</span>
          </div>
          <div>
            <Clock3 size={19} />
            <span>Real-time ride updates</span>
          </div>
          <div>
            <MapPin size={19} />
            <span>Door-to-door journeys</span>
          </div>
        </section>

        <section id="how-it-works" className="section how-section">
          <div className="section-heading">
            <div className="eyebrow">THE EASY WAY</div>
            <h2>
              Three steps. <em>That's it.</em>
            </h2>
            <p>
              Getting where you need to go shouldn't take a plan of its own.
            </p>
          </div>

          <div className="steps-grid">
            <article>
              <span className="step-number">01</span>
              <div className="step-icon">
                <MapPin />
              </div>
              <h3>Choose your route</h3>
              <p>
                Tell us where you're starting and where you need to be.
                We'll take it from there.
              </p>
            </article>

            <article>
              <span className="step-number">02</span>
              <div className="step-icon">
                <CarFront />
              </div>
              <h3>Pick your ride</h3>
              <p>
                Compare cab options and see an estimated fare before you
                confirm anything.
              </p>
            </article>

            <article>
              <span className="step-number">03</span>
              <div className="step-icon">
                <CheckCircle2 />
              </div>
              <h3>Enjoy the journey</h3>
              <p>
                Track your ride, follow updates, and focus on what matters
                at the other end.
              </p>
            </article>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="section-heading">
            <div className="eyebrow">FIND YOUR FIT</div>
            <h2>
              A ride for <em>every kind of day.</em>
            </h2>
          </div>

          <div className="cab-grid">
            <CabCard
                name="Mini"
                description="Quick trips, lighter fares"
                price="₹12/km"
                icon="mini"
            />
            <CabCard
                name="Sedan"
                description="A little extra room"
                price="₹16/km"
                icon="sedan"
            />
            <CabCard
                name="SUV"
                description="Room for everyone"
                price="₹22/km"
                icon="suv"
            />
          </div>
        </section>

        <section className="cta-band">
          <div>
            <div className="eyebrow">READY WHEN YOU ARE</div>
            <h2>Where to next?</h2>
            <p>Your next journey starts with a single tap.</p>
          </div>
          <Link className="button button-primary" to="/register">
            Let's get moving <ArrowRight size={17} />
          </Link>
        </section>

        <Footer />
      </>
  );
}

function CabCard({ name, description, price, icon }) {
  return (
      <article className="cab-card">
        <div className={`cab-illustration ${icon}`}>
          <CarFront size={43} />
          <span className="cab-wheel wheel-one" />
          <span className="cab-wheel wheel-two" />
        </div>
        <div className="cab-card-body">
          <div>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
          <strong>{price}</strong>
        </div>
      </article>
  );
}

function Footer() {
  return (
      <footer className="footer">
        <Link to="/" className="brand">
        <span className="brand-mark">
          <CarFront size={20} />
        </span>
          wayfare<span className="brand-dot">.</span>
        </Link>
        <span>Thoughtful rides for wherever life takes you.</span>
        <small>© 2026 Wayfare. Portfolio project.</small>
      </footer>
  );
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [accountType, setAccountType] = useState('RIDER');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const endpoint = mode === 'register'
          ? (accountType === 'DRIVER' ? '/auth/register/driver' : '/auth/register')
          : '/auth/login';
      const { data } = await api.post(endpoint, form);

      saveSession(data);
      onAuth(getUser());

      navigate(
          data.role === 'DRIVER'
              ? '/driver'
              : data.role === 'ADMIN'
                  ? '/admin'
                  : '/book'
      );
    } catch (err) {
      setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Could not sign in. Check the backend is running and try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
      <main className="auth-layout">
        <div className="auth-aside">
          <Link to="/" className="brand">
          <span className="brand-mark">
            <CarFront size={21} />
          </span>
            wayfare<span className="brand-dot">.</span>
          </Link>

          <div>
            <div className="eyebrow">YOUR NEXT CHAPTER</div>
            <h1>
              Less getting there.
              <br />
              <em>More being there.</em>
            </h1>
            <p>
              Good journeys start with a little less hassle. Let's get you
              on your way.
            </p>
          </div>

          <span className="aside-note">
          Thoughtful rides, one trip at a time.
        </span>
        </div>

        <div className="auth-main">
          <div className="auth-card">
            <div className="eyebrow">
              {mode === 'register'
                  ? 'CREATE YOUR ACCOUNT'
                  : 'WELCOME BACK'}
            </div>

            <h2>
              {mode === 'register'
                  ? 'Let’s get you moving.'
                  : 'Good to see you again.'}
            </h2>

            <p className="muted">
              {mode === 'register'
                  ? 'Create an account to book your first ride.'
                  : 'Sign in to pick up where you left off.'}
            </p>

            <form onSubmit={submit} className="form-stack">
              {mode === 'register' && (
                  <div className="account-type-picker">
                    <span className="field-label">Account type</span>
                    <div className="account-type-options">
                      <button
                        type="button"
                        className={`button ${accountType === 'RIDER' ? 'button-primary' : 'button-light'} button-small`}
                        onClick={() => setAccountType('RIDER')}
                      >
                        Rider
                      </button>
                      <button
                        type="button"
                        className={`button ${accountType === 'DRIVER' ? 'button-primary' : 'button-light'} button-small`}
                        onClick={() => setAccountType('DRIVER')}
                      >
                        Driver
                      </button>
                    </div>
                    <small>{accountType === 'DRIVER'
                      ? 'Create a driver account to receive and manage ride requests.'
                      : 'Create a rider account to book rides.'}</small>
                  </div>
              )}
              {mode === 'register' && (
                  <label>
                    Full name
                    <input
                        required
                        maxLength="120"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your name"
                    />
                  </label>
              )}

              <label>
                Email address
                <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                />
              </label>

              {mode === 'register' && (
                  <label>
                    Phone number <span className="optional">OPTIONAL</span>
                    <input
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                    />
                  </label>
              )}

              <label>
                Password
                <input
                    required
                    minLength="8"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    placeholder="At least 8 characters"
                />
              </label>

              {error && <div className="error-box">{error}</div>}

              <button
                  disabled={busy}
                  className="button button-primary full-button"
              >
                {busy
                    ? 'Please wait…'
                    : mode === 'register'
                        ? 'Create account'
                        : 'Sign in'}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'register'
                  ? 'Already have an account?'
                  : 'New to Wayfare?'}{' '}
              <Link to={mode === 'register' ? '/login' : '/register'}>
                {mode === 'register' ? 'Sign in' : 'Create an account'}
              </Link>
            </p>

            <p className="legal-note">
              By continuing, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </main>
  );
}

function BookPage() {
  const [pickup, setPickup] = useState({
    address: 'Benz Circle, Vijayawada',
    lat: 16.4971,
    lng: 80.648,
  });

  const [destination, setDestination] = useState({
    address: 'Vijayawada Railway Station',
    lat: 16.5178,
    lng: 80.6188,
  });

  const [category, setCategory] = useState('MINI');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeReady, setRouteReady] = useState(false);
  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [rides, setRides] = useState([]);
  const [activeField, setActiveField] = useState('pickup');

  // Keep the rider's ride history in sync with driver actions. This uses
  // lightweight polling so it works even when WebSocket updates are not wired
  // into this page yet.
  useEffect(() => {
    let active = true;

    async function refreshMyRides() {
      try {
        const { data } = await api.get('/rides/mine');
        if (active) setRides(data);
      } catch (error) {
        // Keep the last known ride list visible if a temporary request fails.
      }
    }

    refreshMyRides();
    const timer = window.setInterval(refreshMyRides, 4000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  // Request a fare estimate only when a valid route is available.
  useEffect(() => {
    let cancelled = false;

    async function estimate() {
      if (
          !routeReady ||
          distance == null ||
          duration == null
      ) {
        setFare(null);
        return;
      }

      setFare(null);
      setMessage('');

      try {
        const { data } = await api.post('/rides/fare-estimate', {
          pickup,
          destination,
          distanceKm: distance,
          durationMinutes: duration,
          category,
        });

        if (!cancelled) {
          setFare(data.estimatedFare);
        }
      } catch (error) {
        if (!cancelled) {
          setFare(null);
          setMessage(
              error.response?.data?.message ||
              'Could not calculate fare. Check the backend.'
          );
        }
      }
    }

    estimate();

    return () => {
      cancelled = true;
    };
  }, [
    category,
    distance,
    duration,
    pickup,
    destination,
    routeReady,
  ]);

  function selectPoint(point, location) {
    const field = location || activeField;

    // A new location invalidates the previous route and fare.
    setRouteReady(false);
    setFare(null);
    setDistance(null);
    setDuration(null);
    setMessage('');

    if (field === 'pickup') {
      setPickup(point);
    } else {
      setDestination(point);
    }
  }

  function handleRouteChange({ distanceKm, durationMinutes }) {
    if (
        !Number.isFinite(distanceKm) ||
        !Number.isFinite(durationMinutes)
    ) {
      return;
    }

    setDistance(distanceKm);
    setDuration(durationMinutes);
    setRouteReady(true);
  }

  async function book() {
    if (
        busy ||
        !routeReady ||
        fare == null ||
        distance == null ||
        duration == null
    ) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const { data } = await api.post('/rides', {
        pickup,
        destination,
        distanceKm: distance,
        durationMinutes: duration,
        category,
      });

      setMessage(
          `Ride #${data.id} requested. We'll show status updates here as they arrive.`
      );

      setRides((previous) => [data, ...previous]);
    } catch (error) {
      setMessage(
          error.response?.data?.message ||
          'Booking failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  const categories = [
    {
      id: 'MINI',
      name: 'Mini',
      desc: 'Affordable everyday rides',
      rate: '₹12/km',
      icon: 'mini',
    },
    {
      id: 'SEDAN',
      name: 'Sedan',
      desc: 'More room to stretch out',
      rate: '₹16/km',
      icon: 'sedan',
    },
    {
      id: 'SUV',
      name: 'SUV',
      desc: 'Space for your whole crew',
      rate: '₹22/km',
      icon: 'suv',
    },
  ];

  return (
      <>
        <div className="dashboard-page">
          <div className="page-heading">
            <div>
              <div className="eyebrow">LET'S GET YOU THERE</div>
              <h1>
                Where are we <em>headed?</em>
              </h1>
              <p>
                Choose your stops, find your ride, and leave the rest to us.
              </p>
            </div>

            <span className="user-chip">
            <MapPin size={14} /> Vijayawada demo
          </span>
          </div>

          <div className="booking-layout">
            <section className="booking-panel">
              <div className="panel-head">
                <div>
                  <span className="panel-kicker">YOUR JOURNEY</span>
                  <h2>Plan your ride</h2>
                </div>
                <span className="step-pill">STEP 01 / 02</span>
              </div>

              <div className="location-form">
                <div className="location-symbols">
                  <span className="symbol-pickup" />
                  <span className="symbol-line" />
                  <span className="symbol-drop" />
                </div>

                <label>
                  Pickup location
                  <input
                      value={pickup.address}
                      onFocus={() => setActiveField('pickup')}
                      onChange={(e) => {
                        setPickup({
                          ...pickup,
                          address: e.target.value,
                        });
                        setRouteReady(false);
                        setFare(null);
                      }}
                      placeholder="Where should we pick you up?"
                  />
                  <small className="field-help">
                    Click the map to set exact coordinates.
                  </small>
                </label>

                <label>
                  Destination
                  <input
                      value={destination.address}
                      onFocus={() => setActiveField('destination')}
                      onChange={(e) => {
                        setDestination({
                          ...destination,
                          address: e.target.value,
                        });
                        setRouteReady(false);
                        setFare(null);
                      }}
                      placeholder="Where are you going?"
                  />
                  <small className="field-help">
                    Select a point on the map to update its coordinates.
                  </small>
                </label>
              </div>

              <div className="map-section-head">
                <strong>Route preview</strong>
                <span>
                <span className="live-dot" />
                  {import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                      ? 'MAP CONNECTED'
                      : 'DEMO LOCATIONS'}
              </span>
              </div>

              <MapPanel
                  pickup={pickup}
                  destination={destination}
                  selectedLocation={activeField}
                  onSelect={selectPoint}
                  onRouteChange={handleRouteChange}
              />

              <div className="route-metrics">
                <div>
                  <span>DISTANCE</span>
                  <strong>
                    {distance == null ? '—' : distance.toFixed(1)}
                    <small> km</small>
                  </strong>
                </div>

                <div>
                  <span>EST. DURATION</span>
                  <strong>
                    {duration == null ? '—' : duration}
                    <small> min</small>
                  </strong>
                </div>

                <div>
                  <span>FARE ESTIMATE</span>
                  <strong>
                    {fare == null ? '—' : money(fare)}
                  </strong>
                </div>
              </div>

              <p className="muted small-note">
                Distance and duration are calculated from the driving route.
                Fare estimates require the backend to be running.
              </p>
            </section>

            <aside className="ride-options">
              <div className="panel-head">
                <div>
                  <span className="panel-kicker">CHOOSE YOUR COMFORT</span>
                  <h2>Ride options</h2>
                </div>
              </div>

              <div className="category-options">
                {categories.map((cab) => (
                    <button
                        key={cab.id}
                        onClick={() => setCategory(cab.id)}
                        className={`category-option ${
                            category === cab.id ? 'selected' : ''
                        }`}
                    >
                  <span className={`option-car ${cab.icon}`}>
                    <CarFront size={25} />
                  </span>

                      <span className="option-copy">
                    <strong>{cab.name}</strong>
                    <small>{cab.desc}</small>
                  </span>

                      <span className="option-price">
                    <strong>
                      {fare == null
                          ? '—'
                          : money(
                              Number(fare) *
                              (cab.id === category
                                  ? 1
                                  : cab.id === 'SEDAN'
                                      ? 1.25
                                      : cab.id === 'SUV'
                                          ? 1.65
                                          : 1)
                          )}
                    </strong>
                    <small>{cab.rate}</small>
                  </span>

                      <span className="radio-dot" />
                    </button>
                ))}
              </div>

              <div className="fare-summary">
                <div>
                  <span>Estimated fare</span>
                  <strong>
                    {fare == null ? '—' : money(fare)}
                  </strong>
                </div>

                <div>
                  <span>Pay for what you ride</span>
                  <span className="muted">Final fare may vary</span>
                </div>

                <hr />

                <div>
                  <span>Payment</span>
                  <strong>
                    <CreditCard size={15} /> Online / demo
                  </strong>
                </div>
              </div>

              {message && (
                  <div
                      className={
                        message.startsWith('Ride #')
                            ? 'success-box'
                            : 'error-box'
                      }
                      role="status"
                  >
                    {message}
                  </div>
              )}

              <button
                  className="button button-primary full-button"
                  onClick={book}
                  disabled={
                      busy ||
                      !routeReady ||
                      fare == null
                  }
              >
                {busy ? 'Requesting ride…' : 'Confirm booking'}
                <ArrowRight size={16} />
              </button>

              <p className="secure-note">
                <ShieldCheck size={14} />
                No payment is charged in this demo flow.
              </p>
            </aside>
          </div>

          <section className="history-section">
            <div className="section-inline">
              <div>
                <div className="eyebrow">YOUR JOURNEYS</div>
                <h2>Recent rides</h2>
              </div>
              <div className="section-inline">
                <span className="history-count">
                  {rides.length} {rides.length === 1 ? 'ride' : 'rides'}
                </span>
                <span className="muted small-note" title="Ride status is refreshed automatically">
                  <span className="live-dot" /> Updates every 4 seconds
                </span>
              </div>
            </div>

            {rides.length === 0 ? (
                <div className="empty-state">
                  <History size={25} />
                  <strong>Your ride history starts here</strong>
                  <span>
                Once you book a ride, you'll find the details here.
              </span>
                </div>
            ) : (
                <div className="ride-list">
                  {rides.map((ride) => (
                      <article className="ride-row" key={ride.id}>
                  <span className="ride-row-icon">
                    <CarFront />
                  </span>

                        <div className="ride-row-route">
                          <strong>
                            {ride.pickupAddress} → {ride.destinationAddress}
                          </strong>
                          <small>
                            Ride #{ride.id} · {ride.distanceKm} km ·{' '}
                            {ride.cabCategory}
                          </small>
                        </div>

                        <strong>{money(ride.estimatedFare)}</strong>

                        <span
                            className={`status status-${String(
                                ride.status
                            ).toLowerCase()}`}
                        >
                    {String(ride.status).replaceAll('_', ' ')}
                  </span>
                      </article>
                  ))}
                </div>
            )}
          </section>
        </div>

        <Footer />
      </>
  );
}

function DriverPage() {
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');

  async function refresh() {
    try {
      const { data } = await api.get('/driver/rides/available');
      setRides(data);
      setMessage('');
    } catch {
      setMessage(
          'Driver access requires a DRIVER account. See README for demo setup.'
      );
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function accept(id) {
    try {
      await api.post(`/driver/rides/${id}/accept`);
      setMessage(`Ride #${id} accepted.`);
      await refresh();
    } catch (error) {
      setMessage(
          error.response?.data?.detail || error.response?.data?.message || 'Could not accept ride.'
      );
    }
  }

  async function decline(id) {
    try {
      await api.post(`/driver/rides/${id}/decline`);
      setRides((previous) => previous.filter((ride) => ride.id !== id));
      setMessage(`Ride #${id} declined. It remains available to other drivers.`);
    } catch (error) {
      setMessage(
          error.response?.data?.detail || error.response?.data?.message || 'Could not decline ride.'
      );
    }
  }

  return (
      <>
        <div className="dashboard-page">
          <div className="page-heading">
            <div>
              <div className="eyebrow">DRIVER SPACE</div>
              <h1>
                Good day. Ready to <em>roll?</em>
              </h1>
              <p>New ride requests will show up here when riders book.</p>
            </div>
            <span className="status status-accepted">
            ● Available requests
          </span>
          </div>

          {message && <div className="success-box">{message}</div>}

          <section className="history-section">
            <div className="section-inline">
              <h2>Incoming requests</h2>
              <button
                  className="button button-light button-small"
                  onClick={refresh}
              >
                Refresh requests
              </button>
            </div>

            {rides.length === 0 ? (
                <div className="empty-state">
                  <CarFront size={28} />
                  <strong>You're all caught up</strong>
                  <span>No open ride requests right now.</span>
                </div>
            ) : (
                <div className="driver-request-list">
                  {rides.map((ride) => (
                      <article className="request-card" key={ride.id}>
                        <div className="request-top">
                    <span className="status status-requested">
                      NEW REQUEST
                    </span>
                          <strong>{money(ride.estimatedFare)}</strong>
                        </div>

                        <p>
                          <MapPin size={15} /> {ride.pickupAddress}
                        </p>
                        <p>
                          <span className="destination-bullet" />{' '}
                          {ride.destinationAddress}
                        </p>

                        <div className="request-meta">
                          {ride.distanceKm} km · {ride.durationMinutes} min ·{' '}
                          {ride.cabCategory}
                        </div>

                        <div className="driver-request-actions">
                          <button
                              className="button button-primary"
                              onClick={() => accept(ride.id)}
                          >
                            Accept ride <ArrowRight size={15} />
                          </button>
                          <button
                              className="button button-light"
                              onClick={() => decline(ride.id)}
                          >
                            Decline
                          </button>
                        </div>
                      </article>
                  ))}
                </div>
            )}
          </section>
        </div>

        <Footer />
      </>
  );
}

function AdminPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
        .get('/admin/rides')
        .then((response) => setRides(response.data))
        .catch(() =>
            setError(
                'Admin access requires an ADMIN account. Configure a local demo admin as described in README.'
            )
        );
  }, []);

  return (
      <>
        <div className="dashboard-page">
          <div className="page-heading">
            <div>
              <div className="eyebrow">OPERATIONS</div>
              <h1>
                Admin <em>overview.</em>
              </h1>
              <p>A quick look at current ride requests.</p>
            </div>
            <span className="user-chip">
            <ShieldCheck size={15} /> Admin
          </span>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="admin-stats">
            <div>
              <span>Total loaded rides</span>
              <strong>{rides.length}</strong>
            </div>
            <div>
              <span>Requested</span>
              <strong>
                {rides.filter((ride) => ride.status === 'REQUESTED').length}
              </strong>
            </div>
            <div>
              <span>Completed</span>
              <strong>
                {rides.filter((ride) => ride.status === 'COMPLETED').length}
              </strong>
            </div>
            <div>
              <span>Estimated value</span>
              <strong>
                {money(
                    rides.reduce(
                        (sum, ride) =>
                            sum + Number(ride.estimatedFare || 0),
                        0
                    )
                )}
              </strong>
            </div>
          </div>

          <section className="history-section">
            <h2>Ride activity</h2>

            {rides.length === 0 ? (
                <div className="empty-state">
                  <Users size={26} />
                  <strong>No rides to show</strong>
                  <span>New bookings will appear here.</span>
                </div>
            ) : (
                <div className="ride-list">
                  {rides.map((ride) => (
                      <article className="ride-row" key={ride.id}>
                  <span className="ride-row-icon">
                    <CarFront />
                  </span>

                        <div className="ride-row-route">
                          <strong>
                            {ride.pickupAddress} → {ride.destinationAddress}
                          </strong>
                          <small>
                            Ride #{ride.id} · {ride.cabCategory}
                          </small>
                        </div>

                        <strong>{money(ride.estimatedFare)}</strong>

                        <span
                            className={`status status-${String(
                                ride.status
                            ).toLowerCase()}`}
                        >
                    {ride.status}
                  </span>
                      </article>
                  ))}
                </div>
            )}
          </section>
        </div>

        <Footer />
      </>
  );
}

function Protected({ user, roles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
        <Navigate
            to={
              user.role === 'DRIVER'
                  ? '/driver'
                  : user.role === 'ADMIN'
                      ? '/admin'
                      : '/book'
            }
            replace
        />
    );
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(getUser());

  function onLogout() {
    logout();
    setUser(null);
  }

  return (
      <>
        <Header user={user} onLogout={onLogout} />

        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
              path="/login"
              element={
                user ? (
                    <Navigate to={user.role === 'DRIVER' ? '/driver' : user.role === 'ADMIN' ? '/admin' : '/book'} replace />
                ) : (
                    <AuthPage mode="login" onAuth={setUser} />
                )
              }
          />

          <Route
              path="/register"
              element={
                user ? (
                    <Navigate to={user.role === 'DRIVER' ? '/driver' : user.role === 'ADMIN' ? '/admin' : '/book'} replace />
                ) : (
                    <AuthPage mode="register" onAuth={setUser} />
                )
              }
          />

          <Route
              path="/book"
              element={
                <Protected user={user} roles={['RIDER', 'ADMIN']}>
                  <BookPage />
                </Protected>
              }
          />

          <Route
              path="/driver"
              element={
                <Protected user={user} roles={['DRIVER', 'ADMIN']}>
                  <DriverPage />
                </Protected>
              }
          />

          <Route
              path="/admin"
              element={
                <Protected user={user} roles={['ADMIN']}>
                  <AdminPage />
                </Protected>
              }
          />

          <Route
              path="*"
              element={
                <main className="dashboard-page">
                  <h1>Page not found</h1>
                  <Link to="/">Back home</Link>
                </main>
              }
          />
        </Routes>
      </>
  );
}
