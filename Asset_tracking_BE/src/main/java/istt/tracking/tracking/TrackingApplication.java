package istt.tracking.tracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@SpringBootApplication
public class TrackingApplication {
//	static String LICENSE_KEY = "NzAwMWVjNjcwMjA4YTIyNDk0MDE2NTBlNTdmOTM2N2Y3MTkzYTY3NDcyNzE5ZDJjNjU2OTI2YThjYTEyMWM4M2MzYmQ2MTJmMWFhY2NlN2Q2MjNlNzg1NGU2OGRhNjljYzRmZWE3MmU2YzUzY2JkYjVkYjNkZmNjMTM1Y2U3YjI=";
//
//	public static String generateKey() {
//
//		LocalDate dt = LocalDate.of(2025, 8, 18);
//		Date validity = Date.from(dt.atStartOfDay().toInstant(ZoneOffset.UTC));
//
//		byte[] keyBytes = Decoders.BASE64.decode(LICENSE_KEY);
//		SecretKey key = Keys.hmacShaKeyFor(keyBytes);
//
//		String license = Jwts.builder().setSubject("istt VNPT SPOOFING 2024").claim("CLIENT", "VNPT")
//				.signWith(key, SignatureAlgorithm.HS512).setExpiration(validity).compact();
//
//		System.out.println(license);
//		return license;
//	}

	public static void main(String[] args) {

//		JwtParser parser = Jwts.parser().setSigningKey(LICENSE_KEY);
//
//		Claims claim = parser.parseClaimsJws(generateKey()).getBody();
//		System.out.println("expiration: " + claim.getExpiration());

		SpringApplication.run(TrackingApplication.class, args);
	}
	
	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		return mapper;
	}
}
