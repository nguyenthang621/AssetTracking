package istt.tracking.tracking.security.securityv2;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.repository.UserRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepo userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// Let people login with either username or email
		User user = userRepository.findByUsername(username).orElseThrow(
				() -> new UsernameNotFoundException("User not found with username: " + username));

		return UserPrincipal.create(user);
	}

	// This method is used by JWTAuthenticationFilter
	@Transactional
	public UserDetails loadUserById(String id) {
		User user = userRepository.findByUserId(id)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with id : " + id));

		return UserPrincipal.create(user);
	}
}