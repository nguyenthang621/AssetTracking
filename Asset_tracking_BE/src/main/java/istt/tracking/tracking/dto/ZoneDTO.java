package istt.tracking.tracking.dto;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import istt.tracking.tracking.entity.Asset;
import lombok.Data;

@Data
public class ZoneDTO {
	private String zoneId;

	private String nameZone;

	private String description;

	private List<PointDTO> coordinates;

	private String status;

	private String type;

	private Set<Asset> assets = new HashSet<>();

	private String fillColor;

	private String fillOpacity;

	private String strokeColor;

	private String strokeOpacity;

	private String strokeWeight;

	private String rules;
	
	private String positionTitle;

	private String createBy;
	
	private List<String> alertTo;
}
