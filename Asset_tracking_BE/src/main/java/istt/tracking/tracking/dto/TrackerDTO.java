package istt.tracking.tracking.dto;

import java.util.HashSet;
import java.util.Set;

import istt.tracking.tracking.entity.Asset;
import istt.tracking.tracking.entity.Zone;
import lombok.Data;

@Data
public class TrackerDTO {

	private String trackerId;

	private String nameTracker;

	private String description;

	private String status;

	private String type;
	
	private String dataset;

	private Set<Asset> assets = new HashSet<>();

	private Set<Zone> zones = new HashSet<>();
}
