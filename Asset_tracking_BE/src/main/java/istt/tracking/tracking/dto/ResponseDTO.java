package istt.tracking.tracking.dto;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> {

	@Builder.Default
	private String code = String.valueOf(HttpStatus.OK.value());

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Boolean success = false;
	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String message;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long totalElements;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long numberOfElements;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long totalPages;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private T data;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String refreshToken;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String accessToken;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String sessionId;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long expired;

}
