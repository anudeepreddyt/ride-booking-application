package com.cabbooking.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RideDeclineRepository extends JpaRepository<RideDecline, Long> {
    @Query("select count(d) from RideDecline d where d.ride.id = :rideId and lower(d.driver.email) = lower(:email)")
    long countForRideAndDriver(@Param("rideId") Long rideId, @Param("email") String email);
}
