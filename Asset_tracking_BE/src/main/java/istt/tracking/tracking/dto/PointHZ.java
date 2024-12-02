package istt.tracking.tracking.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PointHZ {
	private double[] point;
	private String address;
	private List<String> zoneEntered;
}
