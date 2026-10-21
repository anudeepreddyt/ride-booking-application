package com.cabbooking.ride;

import com.cabbooking.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class RideService {
    private final RideRepository rides; private final UserRepository users; private final FareService fares;
    private final SimpMessagingTemplate messaging;
    private final RideDeclineRepository declines;
    public RideService(RideRepository rides,UserRepository users,FareService fares,
                       SimpMessagingTemplate messaging, RideDeclineRepository declines) {
        this.rides=rides;this.users=users;this.fares=fares;this.messaging=messaging;this.declines=declines;
    }
    public BigDecimal fare(RideDtos.FareRequest r) { return fares.estimate(r.distanceKm(),r.durationMinutes(),r.category()); }
    @Transactional
    public RideDtos.RideResponse book(String email,RideDtos.BookingRequest r) {
        AppUser rider=users.findByEmailIgnoreCase(email).orElseThrow();
        if(rider.getRole()!=Role.RIDER) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only riders can book rides");
        BigDecimal fare=fares.estimate(r.distanceKm(),r.durationMinutes(),r.category());
        Ride ride=rides.save(new Ride(rider,r.pickup().address(),r.pickup().lat(),r.pickup().lng(),
            r.destination().address(),r.destination().lat(),r.destination().lng(),
            BigDecimal.valueOf(r.distanceKm()).setScale(2,java.math.RoundingMode.HALF_UP),
            r.durationMinutes(),r.category(),fare));
        messaging.convertAndSend("/topic/rides/requests",toResponse(ride));
        return toResponse(ride);
    }
    public List<RideDtos.RideResponse> myRides(String email) {
        return rides.findByRiderEmailOrderByCreatedAtDesc(email).stream().map(this::toResponse).toList();
    }
    public List<RideDtos.RideResponse> available(String email) {
        AppUser driver=users.findByEmailIgnoreCase(email).orElseThrow();
        if(driver.getRole()!=Role.DRIVER && driver.getRole()!=Role.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Driver access required");
        return rides.findByStatusOrderByCreatedAtAsc(RideStatus.REQUESTED).stream()
                .filter(ride -> declines.countForRideAndDriver(ride.getId(), email) == 0)
                .map(this::toResponse).toList();
    }
    public List<RideDtos.RideResponse> allRides() {
        return rides.findAll().stream().map(this::toResponse).toList();
    }
    @Transactional
    public void decline(Long id,String email) {
        AppUser driver=users.findByEmailIgnoreCase(email).orElseThrow();
        if(driver.getRole()!=Role.DRIVER)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only drivers can decline rides");
        Ride ride=rides.findByIdForUpdate(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Ride not found"));
        if(ride.getStatus()!=RideStatus.REQUESTED)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Ride is no longer available");
        if(declines.countForRideAndDriver(id,email) == 0)
            declines.save(new RideDecline(ride,driver));
    }
    @Transactional
    public RideDtos.RideResponse accept(Long id,String email) {
        AppUser driver=users.findByEmailIgnoreCase(email).orElseThrow();
        if(driver.getRole()!=Role.DRIVER) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only drivers can accept rides");
        Ride ride=rides.findByIdForUpdate(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Ride not found"));
        if(ride.getStatus()!=RideStatus.REQUESTED) throw new ResponseStatusException(HttpStatus.CONFLICT,"Ride is no longer available");
        ride.assignDriver(driver); RideDtos.RideResponse result=toResponse(ride);
        messaging.convertAndSend("/topic/rides/"+id,result); return result;
    }
    @Transactional
    public RideDtos.RideResponse updateStatus(Long id,String email,RideStatus next) {
        AppUser actor=users.findByEmailIgnoreCase(email).orElseThrow();
        Ride ride=rides.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Ride not found"));
        boolean isDriver=ride.getDriver()!=null && ride.getDriver().getId().equals(actor.getId());
        boolean isRider=ride.getRider().getId().equals(actor.getId());
        if(actor.getRole()!=Role.ADMIN && !isDriver && !(isRider && next==RideStatus.CANCELLED))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"You cannot update this ride");
        boolean allowed = switch(ride.getStatus()) {
            case ACCEPTED -> next==RideStatus.DRIVER_ARRIVING || next==RideStatus.ARRIVED;
            case DRIVER_ARRIVING -> next==RideStatus.ARRIVED;
            case ARRIVED -> next==RideStatus.IN_PROGRESS;
            case IN_PROGRESS -> next==RideStatus.COMPLETED;
            case REQUESTED -> next==RideStatus.CANCELLED;
            default -> false;
        };
        if(actor.getRole()==Role.ADMIN) allowed=true;
        if(!allowed) throw new ResponseStatusException(HttpStatus.CONFLICT,"Invalid ride status transition");
        ride.setStatus(next); RideDtos.RideResponse result=toResponse(ride);
        messaging.convertAndSend("/topic/rides/"+id,result); return result;
    }
    private RideDtos.RideResponse toResponse(Ride r) {
        return new RideDtos.RideResponse(r.getId(),r.getRider().getId(),r.getDriver()==null?null:r.getDriver().getId(),
            r.getPickupAddress(),r.getPickupLat(),r.getPickupLng(),r.getDestinationAddress(),r.getDestinationLat(),
            r.getDestinationLng(),r.getDistanceKm(),r.getDurationMinutes(),r.getCabCategory(),r.getEstimatedFare(),
            r.getFinalFare(),r.getStatus(),r.getCreatedAt());
    }
}
