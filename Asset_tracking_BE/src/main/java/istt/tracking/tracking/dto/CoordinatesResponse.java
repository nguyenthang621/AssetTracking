package istt.tracking.tracking.dto;

import com.vividsolutions.jts.geom.Point;

import istt.tracking.tracking.entity.Tracker;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class CoordinatesResponse {
	private Tracker tracker;

	private Point point;

}
