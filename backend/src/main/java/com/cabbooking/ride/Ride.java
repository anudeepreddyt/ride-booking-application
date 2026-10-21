package com.cabbooking.ride;

import com.cabbooking.user.AppUser;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name="rides")
public class Ride {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="rider_id",nullable=false) private AppUser rider;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="driver_id") private AppUser driver;
    @Column(name="pickup_address",nullable=false) private String pickupAddress;
    @Column(name="pickup_lat",nullable=false) private double pickupLat;
    @Column(name="pickup_lng",nullable=false) private double pickupLng;
    @Column(name="destination_address",nullable=false) private String destinationAddress;
    @Column(name="destination_lat",nullable=false) private double destinationLat;
    @Column(name="destination_lng",nullable=false) private double destinationLng;
    @Column(name="distance_km",nullable=false,precision=8,scale=2) private BigDecimal distanceKm;
    @Column(name="duration_minutes",nullable=false) private int durationMinutes;
    @Enumerated(EnumType.STRING) @Column(name="cab_category",nullable=false) private CabCategory cabCategory;
    @Column(name="estimated_fare",nullable=false,precision=10,scale=2) private BigDecimal estimatedFare;
    @Column(name="final_fare",precision=10,scale=2) private BigDecimal finalFare;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private RideStatus status=RideStatus.REQUESTED;
    @Column(name="created_at",nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
    @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt=LocalDateTime.now();
    protected Ride(){}
    public Ride(AppUser rider,String pa,double plat,double plng,String da,double dlat,double dlng,
                BigDecimal distance,int duration,CabCategory category,BigDecimal fare) {
        this.rider=rider;this.pickupAddress=pa;this.pickupLat=plat;this.pickupLng=plng;
        this.destinationAddress=da;this.destinationLat=dlat;this.destinationLng=dlng;
        this.distanceKm=distance;this.durationMinutes=duration;this.cabCategory=category;this.estimatedFare=fare;
    }
    public Long getId(){return id;} public AppUser getRider(){return rider;} public AppUser getDriver(){return driver;}
    public String getPickupAddress(){return pickupAddress;} public double getPickupLat(){return pickupLat;}
    public double getPickupLng(){return pickupLng;} public String getDestinationAddress(){return destinationAddress;}
    public double getDestinationLat(){return destinationLat;} public double getDestinationLng(){return destinationLng;}
    public BigDecimal getDistanceKm(){return distanceKm;} public int getDurationMinutes(){return durationMinutes;}
    public CabCategory getCabCategory(){return cabCategory;} public BigDecimal getEstimatedFare(){return estimatedFare;}
    public BigDecimal getFinalFare(){return finalFare;} public RideStatus getStatus(){return status;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public void assignDriver(AppUser driver){this.driver=driver;this.status=RideStatus.ACCEPTED;touch();}
    public void setStatus(RideStatus status){this.status=status;if(status==RideStatus.COMPLETED)this.finalFare=estimatedFare;touch();}
    private void touch(){this.updatedAt=LocalDateTime.now();}
}
