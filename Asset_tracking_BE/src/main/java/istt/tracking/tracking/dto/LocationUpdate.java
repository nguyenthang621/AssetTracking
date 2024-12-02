package istt.tracking.tracking.dto;

import lombok.Data;

@Data
public class LocationUpdate {
	private double latitude;
	private double longitude;
	private String inside;

}