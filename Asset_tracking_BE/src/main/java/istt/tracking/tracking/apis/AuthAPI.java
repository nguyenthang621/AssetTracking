package istt.tracking.tracking.apis;

import java.util.Optional;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.LoginRequest;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.UserDTO;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.repository.UserRepo;
import istt.tracking.tracking.security.securityv2.CurrentUser;
import istt.tracking.tracking.security.securityv2.UserPrincipal;
import istt.tracking.tracking.services.AuthService;
import istt.tracking.tracking.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthAPI {
	@Autowired
	UserRepo userRepo;

	@Autowired
	UserService userService;

	@Autowired
	AuthService authService;

	private static final String ENTITY_NAME = "Auth";

	@PostMapping("/signin")
	public ResponseDTO<String> signin(@Valid @RequestBody LoginRequest loginRequest) {

		Optional<User> userOp = userRepo.findByUsername(loginRequest.getUsername());
		if(userOp.isEmpty()) throw new BadRequestAlertException("Login Fail", ENTITY_NAME, "Login");
		
		return authService.signin(loginRequest, userOp.get());

	}

	@PostMapping("/refreshToken")
	public ResponseDTO<String> handleRefreshToken(
			@RequestParam(value = "refreshtoken", required = true) String refreshtoken) {
		try {
			return authService.handleRefreshToken(refreshtoken);

		} catch (Exception e) {
			throw Problem.builder().withStatus(Status.INTERNAL_SERVER_ERROR).withDetail("SERVER ERROR").build();
		}
	}
	
	@PostMapping("/logout")
    public ResponseDTO<Void> fetchSignoutSite(@CurrentUser UserPrincipal currentuser ) {        
		Optional<User> user = userRepo.findById(currentuser.getUser_id());
		if(user.isEmpty()) throw new BadRequestAlertException("Not Found User", ENTITY_NAME, "Missingdata");
		authService.logout(user.get());
        return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
    }
	@PostMapping("/signup")
	public ResponseDTO<String> signup(@Valid @RequestBody UserDTO userSignUp) {
		Optional<User> userOptional = userRepo.findByUsername(userSignUp.getUsername());
		User user = userOptional.get();

		if (user != null)
			throw new BadRequestAlertException("user " + user.getUsername() + " already exists", ENTITY_NAME,
					"Password wrong");

		UserDTO userDTO = new ModelMapper().map(user, UserDTO.class);
		userService.create(userDTO);

		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setUsername(userSignUp.getUsername());
		loginRequest.setUsername(userSignUp.getPassword());

		return authService.signup(loginRequest, user);

	}
}
