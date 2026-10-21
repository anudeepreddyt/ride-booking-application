package com.cabbooking.ride;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController @RequestMapping("/api")
public class RideController {
    private final RideService service;
    public RideController(RideService service){this.service=service;}
    @PostMapping("/rides/fare-estimate") public FareResponse fare(@Valid @RequestBody RideDtos.FareRequest request) {
        return new FareResponse(service.fare(request));
    }
    public record FareResponse(BigDecimal estimatedFare){}
    @PostMapping("/rides") public RideDtos.RideResponse book(Authentication auth,@Valid @RequestBody RideDtos.BookingRequest request) {
        return service.book(auth.getName(),request);
    }
    @GetMapping("/rides/mine") public List<RideDtos.RideResponse> mine(Authentication auth){return service.myRides(auth.getName());}
    @GetMapping("/driver/rides/available") @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public List<RideDtos.RideResponse> available(Authentication auth){return service.available(auth.getName());}
    @PostMapping("/driver/rides/{id}/accept") @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public RideDtos.RideResponse accept(@PathVariable Long id,Authentication auth){return service.accept(id,auth.getName());}
    @PostMapping("/driver/rides/{id}/decline") @PreAuthorize("hasRole('DRIVER')")
    public void decline(@PathVariable Long id,Authentication auth){service.decline(id,auth.getName());}
    @PatchMapping("/rides/{id}/status") public RideDtos.RideResponse status(@PathVariable Long id,Authentication auth,@Valid @RequestBody RideDtos.StatusRequest request) {
        return service.updateStatus(id,auth.getName(),request.status());
    }
    @GetMapping("/admin/rides") @PreAuthorize("hasRole('ADMIN')")
    public List<RideDtos.RideResponse> all(){return service.allRides();}
}
