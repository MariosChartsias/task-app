package com.example.taskmanager.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secret;

	public String generateToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date()).signWith(SignatureAlgorithm.HS256, secret)
				.compact();
	}

	public String extractUsername(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
	}
}