package istt.tracking.tracking.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;
import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.UserDTO;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.repository.UserRepo;

public interface UserService {
	UserDTO create(UserDTO userDTO);
	UserDTO get(String id);
	UserDTO update(UserDTO userDTO);
	Boolean delete(String id);
	List<UserDTO> search(String name);
}

@Service
@Transactional
class UserServiceImpl implements UserService {

	
	@Autowired
	private UserRepo userRepo;
	
	@Override
	public UserDTO create(UserDTO userDTO) {
		try {
			ModelMapper mapper = new ModelMapper();
			// creatte user
			User user = mapper.map(userDTO, User.class);
			String user_id = UUID.randomUUID().toString().replaceAll("-", "");
			user.setUserId(user_id);
			user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));

			if (userRepo.findByUsername(userDTO.getUsername()).isPresent()) {
				throw new BadRequestAlertException("Bad request: USER already exists", "User", "USER exists");
			}
			userRepo.save(user);
			return mapper.map(user, UserDTO.class);

		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public UserDTO get(String id) {
		try {
			User user = userRepo.findByUserId(id).orElseThrow(NoResultException::new);
			return new ModelMapper().map(user, UserDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public UserDTO update(UserDTO userDTO) {
		try {
			User user = userRepo.findByUserId(userDTO.getUserId()).orElseThrow(NoResultException::new);
			user = new ModelMapper().map(userDTO, User.class);
			userRepo.save(user);
			return userDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public Boolean delete(String id) {
		Optional<User> user = userRepo.findById(id);
		if(user.isEmpty()) return false;
		else {
			userRepo.deleteById(id);
			return true;
		}
	}

	@Override
	public List<UserDTO> search(String name) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
