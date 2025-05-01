package com.example.taskmanager.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter that intercepts all requests to validate JWT tokens.
 * Requests without valid tokens will be rejected except for login and register endpoints.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Allow unrestricted access to auth endpoints
        if (request.getRequestURI().contains("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check for Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

     // Extract token if Authorization header is present
        if (authHeader != null) {
            try {
                // Process the token to remove Bearer prefix and validate basic format
                token = jwtUtil.processToken(authHeader);
                
                // Extract username from the processed token
                username = jwtUtil.extractUsername(token);
            } catch (IllegalArgumentException e) {
                // Token is malformed
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Malformed token: " + e.getMessage());
                return;
            } catch (ExpiredJwtException e) {
                // Token has expired
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expired");
                return;
            } catch (Exception e) {
                // Other JWT exceptions
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            }
        }

        // If no token or invalid token, return unauthorized
        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized");
            return;
        }

        // Continue with valid token
        filterChain.doFilter(request, response);
    }
}