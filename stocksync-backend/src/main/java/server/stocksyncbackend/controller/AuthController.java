package server.stocksyncbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import server.stocksyncbackend.dto.requests.ChangepasswordRequest;
import server.stocksyncbackend.dto.requests.LoginRequest;
import server.stocksyncbackend.dto.requests.RegisterRequest;
import server.stocksyncbackend.dto.responses.TokenResponse;
import server.stocksyncbackend.service.AuthService;
import server.stocksyncbackend.utils.exception.UsernameAlreadyExistsException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth, JWT, and Account management APIs")
public class AuthController {

    private final AuthService authService;

    // localhost:8080/api/auth/login
    // LOGIN
    @Operation(
            summary = "User login",
            description = "Authenticate user and issue access token (header) + refresh token (HttpOnly cookie)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login successful",
                            content = @Content(schema = @Schema(implementation = TokenResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Invalid credentials")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        return ResponseEntity.ok(authService.login(request, response));
    }

    // localhost:8080/api/auth/refresh
    // REFRESH TOKEN
    @Operation(
            summary = "Refresh access token",
            description = "Generate new access token using refresh token from HttpOnly cookie",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Token refreshed"),
                    @ApiResponse(responseCode = "401", description = "Invalid refresh token")
            }
    )
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        return ResponseEntity.ok(authService.refreshToken(request, response));
    }

    // localhost:8080/api/auth/register
    // REGISTER
    @Operation(
            summary = "Register new user",
            description = "Create a new user with roles",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User registered"),
                    @ApiResponse(responseCode = "409", description = "Username already exists")
            }
    )
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest registerRequest
    ) throws UsernameAlreadyExistsException {

        authService.registerUser(registerRequest);
        return ResponseEntity.ok("User registered successfully");
    }

    // localhost:8080/api/auth/logout
    // LOGOUT
    @Operation(
            summary = "Logout user",
            description = "Clears refresh token cookie"
    )
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok("User logged out successfully");
    }

    // CHANGE PASSWORD (PROTECTED)
    @Operation(
            summary = "Change password",
            description = "Change password for authenticated user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangepasswordRequest request,
            Authentication authentication) {

        authService.changePassword(request, authentication);
        return ResponseEntity.ok("Password changed successfully");
    }

}
