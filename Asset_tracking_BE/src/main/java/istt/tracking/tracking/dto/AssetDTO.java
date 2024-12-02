package istt.tracking.tracking.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import istt.tracking.tracking.entity.Tracker;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.entity.Zone;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetDTO {

	private String assetId;

	private String nameAsset;

	private String description;

	private List<String> location;

	private List<String> images;

	private Date resolvedOn;

	private String resolvedBy;

	private String locationPosition;

	private String status;

	private String alert;

	private Date expiredArrivalDate;

	private String destination;

	private Set<User> users = new HashSet<>();

	private Set<Zone> zones = new HashSet<>();

	private Set<Tracker> trackers = new HashSet<>();

	private Boolean arrived;

	private Date arrivedAt;

}
