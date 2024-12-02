package istt.tracking.tracking.dto;

import lombok.Data;

@Data
public class AssestChart {
	private String location;
	private String zoneId;
	private Long count;
	
	public AssestChart(String zoneId,Long count) {
		this.zoneId= zoneId;
		this.count= count;
	}
	
}