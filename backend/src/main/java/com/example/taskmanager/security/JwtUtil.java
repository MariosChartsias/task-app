package com.example.taskmanager.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

/**
 * Utility class for JWT token generation and validation.
 */
@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secret;
	
	// Token validity period - 24 hours
	private final long validityInMilliseconds = 86400000;

	/**
	 * Generates a JWT token for the provided username.
	 * 
	 * @param username The username to include in the token
	 * @return The generated JWT token
	 */
	public String generateToken(String username) {
		Date now = new Date();
		Date validity = new Date(now.getTime() + validityInMilliseconds);
		
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(now)
				.setExpiration(validity)
				.signWith(SignatureAlgorithm.HS256, secret)
				.compact();
	}

	/**
	 * Extracts username from the JWT token.
	 * 
	 * @param token The JWT token to parse
	 * @return The username from the token
	 * @throws JwtException if token is invalid
	 */
	public String extractUsername(String token) {
		return Jwts.parser()
				.setSigningKey(secret)
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
	
	/**
	 * Validates the JWT token.
	 * 
	 * @param token The JWT token to validate
	 * @return true if token is valid, false otherwise
	 */
	public boolean validateToken(String token) {
		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
			return !claims.getBody().getExpiration().before(new Date());
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}
	
	/**
	 * Processes the raw token from the Authorization header,
	 * removing the "Bearer " prefix if present.
	 * 
	 * @param rawToken The token as received in the Authorization header
	 * @return The clean token without Bearer prefix
	 * @throws IllegalArgumentException if the token is null, empty or malformed
	 */
	public String processToken(String rawToken) {
	    if (rawToken == null || rawToken.trim().isEmpty()) {
	        throw new IllegalArgumentException("Token cannot be null or empty");
	    }
	    
	    // Remove Bearer prefix if present
	    String processedToken = rawToken;
	    if (rawToken.startsWith("Bearer ")) {
	        processedToken = rawToken.substring(7); // "Bearer " is 7 characters
	    }
	    
	    // Basic validation that the token looks like a JWT
	    if (!processedToken.contains(".")) {
	        throw new IllegalArgumentException("Token is malformed: doesn't contain JWT sections");
	    }
	    
	    return processedToken;
	}
}