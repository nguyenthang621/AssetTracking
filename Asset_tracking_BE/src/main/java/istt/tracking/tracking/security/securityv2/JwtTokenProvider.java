package istt.tracking.tracking.security.securityv2;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.entity.InvalidToken;
import istt.tracking.tracking.repository.InvalidTokenRepo;

@Component
public class JwtTokenProvider {
	
	@Autowired
	private InvalidTokenRepo invalidTokenRepo;

	@Value("${app.jwtSecret}")
	private String jwtSecret;

	@Value("${app.jwtExpirationAT}")
	private int jwtExpirationAT;

	@Value("${app.jwtExpirationRT}")
	private int jwtExpirationRT;

	public String generateAccessToken(Authentication authentication) {

		UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + jwtExpirationAT);

		return Jwts.builder().setSubject(String.valueOf(userPrincipal.getUser_id())).setIssuedAt(new Date())
				.setExpiration(expiryDate)
				.setId(UUID.randomUUID().toString())
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}
	

	public String generateRefreshToken(String uid) {

		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + jwtExpirationRT);

		return Jwts.builder().setSubject(String.valueOf(uid))
				.setId(UUID.randomUUID().toString())
				.setIssuedAt(new Date()).setExpiration(expiryDate)
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}

	public String getUserIdFromJWT(String token) {
		Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
		
		return String.valueOf(claims.getSubject());
	}
	
	public InvalidToken getToken(String token) {
		Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
		InvalidToken invalidToken = new InvalidToken(claims.getId(),claims.getExpiration());
		return invalidToken;
	}

	
	
	public boolean validateToken(String authToken) {
		try {
//			if(invalidTokenRepo.findById(authToken)!=null) throw new BadRequestAlertException("ExpiredJwtException", authToken, authToken);
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
			return true;
		} catch (SignatureException ex) {
			System.out.println("Invalid JWT signature");
		} catch (MalformedJwtException ex) {
			System.out.println("Invalid JWT token");
		} catch (ExpiredJwtException ex) {
			System.out.println("Expired JWT token");
		} catch (UnsupportedJwtException ex) {
			System.out.println("Unsupported JWT token");
		} catch (IllegalArgumentException ex) {
			System.out.println("JWT claims string is empty.");
		}
		return false;
	}
}