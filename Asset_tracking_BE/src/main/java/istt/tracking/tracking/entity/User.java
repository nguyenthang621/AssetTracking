package istt.tracking.tracking.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "users")
@EqualsAndHashCode(callSuper = false, exclude = { "assets" })
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseModel {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "user_id", updatable = false, nullable = false)
	private String userId;

	@Column(name = "username", nullable = false, unique = true)
	private String username;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "session_id")
	private String sessionId;

	@Column(name = "expired")
	private Long expired;

	@Column(name = "refresh_token")
	private String refreshToken;

	@Column(name = "access_token")
	private String accessToken;

	private String avatar;

	private String status;
	
	@Builder.Default
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinTable(name = "user_asset", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "asset_id"))
	private Set<Asset> assets = new HashSet<>();
}
