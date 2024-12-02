package istt.tracking.tracking.services;

import javax.transaction.Transactional;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Optional;

import javax.persistence.NoResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import istt.tracking.tracking.dto.LoginRequest;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.entity.InvalidToken;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.repository.InvalidTokenRepo;
import istt.tracking.tracking.repository.UserRepo;
import istt.tracking.tracking.security.securityv2.JwtTokenProvider;

public interface AuthService {
	ResponseDTO<String> signin(LoginRequest loginRequest, User user);

	ResponseDTO<String> handleRefreshToken(String refreshToken_in);
	
	void logout(User user);
	ResponseDTO<String> signup(LoginRequest loginRequest, User user);

}
@Service
@Transactional
class AuthServiceImpl implements AuthService {

	@Autowired
	UserRepo userRepo;

	@Autowired
	UserService userService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenProvider tokenProvider;
	
	@Autowired
	private InvalidTokenRepo invalidTokenRepo;

	
	private static final String ENTITY_NAME = "Auth";
	
	@Override
	public ResponseDTO<String> signin(LoginRequest loginRequest, User user) {
		try {

			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), null));

			SecurityContextHolder.getContext().setAuthentication(authentication);

			String accessToken = tokenProvider.generateAccessToken(authentication);
			String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
			user.setRefreshToken(refreshToken);
			
			//chua set sessionId và expired
			userRepo.save(user);
			
			return ResponseDTO.<String>builder().code(String.valueOf(HttpStatus.OK.value())).accessToken(accessToken)
					.refreshToken(refreshToken).build();

		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public ResponseDTO<String> handleRefreshToken(String refreshToken_in) {
		try {
			if(invalidTokenRepo.findById(refreshToken_in).isPresent()) throw new AccessDeniedException("Token expired!!!");
			String username = tokenProvider.getUserIdFromJWT(refreshToken_in);
			if (username.isEmpty())
				throw new AccessDeniedException("Access Denied");

			User user = userRepo.findByUsername(username).orElseThrow(NoResultException::new);
			
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), null));

			String accessToken = tokenProvider.generateAccessToken(authentication);
			String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

			if (user.getExpired() == null)
				throw new AccessDeniedException("Access Denied");
			if (refreshToken_in != user.getRefreshToken())
				throw new AccessDeniedException("Access Denied");
			Timestamp now = new Timestamp(new Date().getTime());
			Timestamp expired = new Timestamp(Long.valueOf(user.getExpired() * 1000));

			if (expired.before(now)) {
				throw new AccessDeniedException("Token expired!!!");
			}
			
			user.setRefreshToken(refreshToken);
			userRepo.save(user);
			return ResponseDTO.<String>builder().code(String.valueOf(HttpStatus.OK.value())).accessToken(accessToken)
					.sessionId(user.getSessionId()).refreshToken(refreshToken).build();

		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public void logout(User user) {
		Optional<User> userOp = userRepo.findByUserId(user.getUserId());
		if(userOp.isPresent()) {
			invalidTokenRepo.save(new InvalidToken(user.getAccessToken(), new Date()));
			invalidTokenRepo.save(new InvalidToken(user.getRefreshToken(), new Date()));
			invalidTokenRepo.save(new InvalidToken(user.getSessionId(), new Date()));
		}
	}
	
	@Override
	public ResponseDTO<String> signup(LoginRequest loginRequest, User user) {
		try {

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), user.getUserId()));
			// Set thông tin authentication vào Security Context
			SecurityContextHolder.getContext().setAuthentication(authentication);

			String accessToken = tokenProvider.generateAccessToken(authentication);
			String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

			user.setRefreshToken(refreshToken);
			
			userRepo.save(user);

			return ResponseDTO.<String>builder().code(String.valueOf(HttpStatus.OK.value())).accessToken(accessToken)
					.refreshToken(refreshToken).build();

		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}
	
}