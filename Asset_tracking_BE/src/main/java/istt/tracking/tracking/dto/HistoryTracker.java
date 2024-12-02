package istt.tracking.tracking.dto;

import java.util.Date;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HistoryTracker {
	private String id;
	private String location;
	private List<String> zoneId;
	private Date timeZoneEntered;
	private Date timneZoneExit;
	private int dwellTime;
}
