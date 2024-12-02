package istt.tracking.tracking.dto;

import java.util.List;

import istt.tracking.tracking.entity.Tracker;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoordinatesDTO {

	private Tracker tracker;

	private String dwellTime;

	private String location;

	private List<String> zoneEntered;

//	@JsonSerialize(using = PointSerializer.class)
	private PointDTO point;

	private boolean isMove;
	
//	private List<List<Double>> coordinates;
}
