package istt.tracking.tracking.dto;

import java.util.List;

import com.vividsolutions.jts.geom.Point;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesDTO2 {
	private String coordinatesId;

	private String dwellTime;

	private String location;

	private List<String> zoneEntered;

	private Point point;
}
