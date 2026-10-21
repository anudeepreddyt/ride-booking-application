package com.cabbooking.auth;

import com.cabbooking.security.JwtService;
import com.cabbooking.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users=users; this.encoder=encoder; this.jwt=jwt;
    }
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email is already registered");
        AppUser user=users.save(new AppUser(request.name().trim(),request.email().trim(),request.phone(),
                encoder.encode(request.password()),Role.RIDER));
        return response(user);
    }
    public AuthDtos.AuthResponse registerDriver(AuthDtos.RegisterRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email is already registered");
        AppUser user=users.save(new AppUser(request.name().trim(),request.email().trim(),request.phone(),
                encoder.encode(request.password()),Role.DRIVER));
        return response(user);
    }
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        AppUser user=users.findByEmailIgnoreCase(request.email()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));
        if (!encoder.matches(request.password(),user.getPasswordHash()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
        return response(user);
    }
    private AuthDtos.AuthResponse response(AppUser user) {
        return new AuthDtos.AuthResponse(jwt.generate(user),user.getId(),user.getName(),user.getEmail(),user.getRole().name());
    }
}
