package istt.tracking.tracking.dto;

import java.time.Duration;

import lombok.Data;

@Data
public class TotalDTO {
	private String timeID;
	private Long totalAsset;
	private Long transit;
	private Long destination;
	private Double turnTime;
}
