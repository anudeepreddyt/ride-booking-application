package com.cabbooking.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=120) private String name;
    @Column(nullable=false, unique=true, length=180) private String email;
    @Column(length=30) private String phone;
    @Column(name="password_hash", nullable=false, length=100) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Role role;
    @Column(name="created_at", nullable=false) private LocalDateTime createdAt = LocalDateTime.now();

    protected AppUser() {}
    public AppUser(String name, String email, String phone, String passwordHash, Role role) {
        this.name=name; this.email=email.toLowerCase(); this.phone=phone; this.passwordHash=passwordHash; this.role=role;
    }
    public Long getId(){return id;} public String getName(){return name;} public String getEmail(){return email;}
    public String getPhone(){return phone;} public String getPasswordHash(){return passwordHash;}
    public Role getRole(){return role;} public LocalDateTime getCreatedAt(){return createdAt;}
}
