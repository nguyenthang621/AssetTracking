package istt.tracking.tracking.dto;

import java.util.HashSet;
import java.util.Set;
import istt.tracking.tracking.entity.Asset;
import lombok.Data;
@Data
public class UserDTO {
	private String userId;
	private String username;
	private String password;
	private String sessionId;
	private Long expired;
	private String refreshToken;
	private String accessToken;
	private String avatar;
	private String status;
	private Set<Asset> assets = new HashSet<>();
}
