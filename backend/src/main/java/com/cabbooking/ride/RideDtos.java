package com.cabbooking.ride;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class RideDtos {
    private RideDtos(){}
    public record LocationRequest(@NotBlank @Size(max=300) String address,
                                  @DecimalMin("-90.0") @DecimalMax("90.0") double lat,
                                  @DecimalMin("-180.0") @DecimalMax("180.0") double lng) {}
    public record FareRequest(@NotNull LocationRequest pickup,@NotNull LocationRequest destination,
                              @DecimalMin("0.1") @DecimalMax("1000.0") double distanceKm,
                              @Min(1) @Max(1440) int durationMinutes,
                              @NotNull CabCategory category) {}
    public record BookingRequest(@NotNull LocationRequest pickup,@NotNull LocationRequest destination,
                                 @DecimalMin("0.1") @DecimalMax("1000.0") double distanceKm,
                                 @Min(1) @Max(1440) int durationMinutes,
                                 @NotNull CabCategory category) {}
    public record RideResponse(Long id, Long riderId, Long driverId, String pickupAddress, double pickupLat,
        double pickupLng, String destinationAddress, double destinationLat, double destinationLng,
        BigDecimal distanceKm, int durationMinutes, CabCategory category, BigDecimal estimatedFare,
        BigDecimal finalFare, RideStatus status, LocalDateTime createdAt) {}
    public record StatusRequest(@NotNull RideStatus status) {}
}
