package com.cabbooking.ride;

import com.cabbooking.user.AppUser;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_declines", uniqueConstraints = @UniqueConstraint(columnNames = {"ride_id", "driver_id"}))
public class RideDecline {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private AppUser driver;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected RideDecline() {}
    public RideDecline(Ride ride, AppUser driver) { this.ride = ride; this.driver = driver; }
}
