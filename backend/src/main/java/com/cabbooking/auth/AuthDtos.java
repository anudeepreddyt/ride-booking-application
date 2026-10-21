package com.cabbooking.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(@NotBlank @Size(max=120) String name,
                                  @Email @NotBlank @Size(max=180) String email,
                                  @Size(max=30) String phone,
                                  @NotBlank @Size(min=8,max=72) String password) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(String token, Long id, String name, String email, String role) {}
}
