package server.stocksyncbackend.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.stocksyncbackend.model.User;
import server.stocksyncbackend.repository.UserRepository;
import server.stocksyncbackend.service.AuthService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // localhost:8080/api/users/me
    @Operation(
            summary = "Get current user info",
            description = "Retrieve information about the authenticated user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/me")
    public User me(Authentication authentication) {
        return authService.me(authentication);
    }

}
