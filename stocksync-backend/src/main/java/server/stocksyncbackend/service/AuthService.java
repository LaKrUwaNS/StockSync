package server.stocksyncbackend.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import server.stocksyncbackend.dto.requests.*;
import server.stocksyncbackend.dto.responses.TokenResponse;
import server.stocksyncbackend.model.*;
import server.stocksyncbackend.repository.*;
import server.stocksyncbackend.utils.CookieUtil;
import server.stocksyncbackend.utils.types.UserStatus;
import server.stocksyncbackend.utils.exception.*;
import server.stocksyncbackend.utils.jwt.JwtService;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    // 🔐 LOGIN
    public TokenResponse login(LoginRequest request, HttpServletResponse response) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(ur -> ur.getRole().getRoleName())
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateAccessToken(user.getUsername(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        CookieUtil.addRefreshToken(response, refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    // 🔄 REFRESH TOKEN
    public TokenResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = CookieUtil.extractRefreshToken(request);

        try {
            jwtService.validateRefreshToken(refreshToken);
        } catch (RuntimeException ex) {
            CookieUtil.clearRefreshToken(response);
            throw new RefreshTokenExpiredException("REFRESH_TOKEN_EXPIRED");
        }

        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User is not active");
        }

        Set<String> roles = user.getRoles().stream()
                .map(ur -> ur.getRole().getRoleName())
                .collect(Collectors.toSet());

        String newAccessToken = jwtService.generateAccessToken(username, roles);
        String newRefreshToken = jwtService.generateRefreshToken(username);

        CookieUtil.addRefreshToken(response, newRefreshToken);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }


    // 📝 REGISTER
    public void registerUser(RegisterRequest request) throws UsernameAlreadyExistsException {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UsernameAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        Set<UserRole> roles = request.getRoles().stream()
                .map(roleName -> {
                    Role role = roleRepository.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

                    return UserRole.builder()
                            .user(savedUser)
                            .role(role)
                            .assignedDate(LocalDateTime.now())
                            .build();
                }).collect(Collectors.toSet());

        savedUser.setRoles(roles);
        userRepository.save(savedUser);
    }

    // 🚪 LOGOUT
    public void logout(HttpServletResponse response) {
        CookieUtil.clearRefreshToken(response);
    }

    // 🔑 CHANGE PASSWORD
    public void changePassword(ChangepasswordRequest request, Authentication authentication)
            throws PasswordNotMachException {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new PasswordNotMachException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // me function for the authentication
    public User me(Authentication authentication) throws UsernameNotFoundException {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationCredentialsNotFoundException("UNAUTHORIZED");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

}
