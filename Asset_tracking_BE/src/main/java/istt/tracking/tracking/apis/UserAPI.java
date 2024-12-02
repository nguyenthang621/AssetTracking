package istt.tracking.tracking.apis;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.UserDTO;
import istt.tracking.tracking.services.UserService;

@RestController
@RequestMapping("/user")
public class UserAPI {
	@Autowired
	private UserService userService;

	private static final String ENTITY_NAME = "isttUser";

	@PostMapping("")
	public ResponseDTO<UserDTO> create(@RequestBody UserDTO userDTO) throws URISyntaxException {
		System.err.println("testAPI");
		if (userDTO.getUsername() == null || userDTO.getPassword() == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}
		userService.create(userDTO);
		return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(userDTO).build();

	}
	@GetMapping("/{id}")
	// @PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseDTO<UserDTO> get(@PathVariable(value = "id") String id) {
		return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(userService.get(id))
				.build();
	}
	
//	@PutMapping("/update-password")
//	public ResponseDTO<Void> updatePassword(@RequestBody @Valid UpdatePassword updatePassword) throws IOException {
//		userService.updatePassword(updatePassword);
//		return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
//	}
	
	@PutMapping("/update")
	public ResponseDTO<UserDTO> update(@RequestBody @Valid UserDTO userDTO) throws IOException {
		if(userDTO.getUserId()==null||userDTO.getUsername()==null|| userDTO.getPassword()==null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}
		return ResponseDTO.<UserDTO>builder().code(String.valueOf(HttpStatus.OK.value())).data(userService.update(userDTO))
				.build();
	}

	@PostMapping("/search")
	public ResponseDTO<List<UserDTO>> search(@RequestBody @Valid UserDTO userDTO) {
		if(userDTO.getUsername()==null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}
		return ResponseDTO.<List<UserDTO>>builder().code(String.valueOf(HttpStatus.OK.value())).data(userService.search(userDTO.getUsername())).build();
	}

	@DeleteMapping("/{id}")
	public ResponseDTO<Void> delete(@PathVariable(value = "id") String id) throws URISyntaxException {
		if (id == null) {
			throw new BadRequestAlertException("Bad request: missing id", ENTITY_NAME, "missing_id");
		}
		userService.delete(id);
		return ResponseDTO.<Void>builder().code(String.valueOf(HttpStatus.OK.value())).build();
	}
	
}
