package server.stocksyncbackend.utils.jwt;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${PRIVATE_KEY_PATH}")
    private String privateKeyPath;

    @Value("${PUBLIC_KEY_PATH}")
    private String publicKeyPath;

    @Value("${ACCESS_TOKEN_EXPIRATION}")
    private Long accessTokenExpiration;

    @Value("${REFRESH_TOKEN_EXPIRATION}")
    private Long refreshTokenExpiration;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    // 🔐 Load RSA keys at startup
    @PostConstruct
    private void loadKeys() {
        try {
            privateKey = loadPrivateKey(privateKeyPath);
            publicKey = loadPublicKey(publicKeyPath);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load RSA keys", e);
        }
    }

    private PrivateKey loadPrivateKey(String path) throws Exception {
        String key = Files.readString(Path.of(path))
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    private PublicKey loadPublicKey(String path) throws Exception {
        String key = Files.readString(Path.of(path))
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(decoded));
    }

    // 🎫 ACCESS TOKEN
    public String generateAccessToken(String username, Set<String> roles) {
        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("type", "ACCESS")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    // 🔄 REFRESH TOKEN
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .subject(username)
                .claim("type", "REFRESH")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    // ✅ VALIDATE TOKEN (JJWT 0.13.0)
    public Jws<Claims> validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token);
        } catch (JwtException ex) {
            throw new RuntimeException("Invalid or expired JWT", ex);
        }
    }

    public String extractUsername(String token) {
        return validateToken(token).getPayload().getSubject();
    }

    public Set<String> extractRoles(String token) {
        Claims claims = validateToken(token).getPayload();

        if (!"ACCESS".equals(claims.get("type"))) {
            throw new RuntimeException("Not an access token");
        }

        List<String> roles = claims.get("roles", List.class);
        return roles == null ? Set.of() : Set.copyOf(roles);
    }

    public void validateRefreshToken(String token) {
        Claims claims = validateToken(token).getPayload();

        if (!"REFRESH".equals(claims.get("type"))) {
            throw new RuntimeException("Not a refresh token");
        }
    }
}
