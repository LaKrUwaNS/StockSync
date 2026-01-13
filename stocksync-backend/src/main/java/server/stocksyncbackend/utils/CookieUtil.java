package server.stocksyncbackend.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class CookieUtil {

    private static final String REFRESH_TOKEN = "refreshToken";
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    private CookieUtil() {}

    // 🍪 ADD REFRESH TOKEN COOKIE
    public static void addRefreshToken(HttpServletResponse response, String token) {

        Cookie cookie = new Cookie(REFRESH_TOKEN, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(REFRESH_TOKEN_MAX_AGE);

        response.addCookie(cookie);
    }

    // ❌ CLEAR REFRESH TOKEN COOKIE
    public static void clearRefreshToken(HttpServletResponse response) {

        Cookie cookie = new Cookie(REFRESH_TOKEN, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }

    // 🔍 EXTRACT REFRESH TOKEN FROM REQUEST
    public static String extractRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new RuntimeException("No cookies found");
        }

        for (Cookie cookie : request.getCookies()) {
            if (REFRESH_TOKEN.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new RuntimeException("Refresh token cookie not found");
    }
}
