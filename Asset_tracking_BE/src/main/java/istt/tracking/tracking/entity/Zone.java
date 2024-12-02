package istt.tracking.tracking.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import istt.tracking.tracking.dto.PointDTO;
import istt.tracking.tracking.utils.PointListConverter;
import istt.tracking.tracking.utils.StringListConverter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "zone")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Zone extends BaseModel implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "zone_id", updatable = false, nullable = false)
	private String zoneId;

	@Column(name = "name_zone")
	private String nameZone;

	@Column(name = "description")
	private String description;

	@Convert(converter = PointListConverter.class)
	@Column(name = "coordinates", columnDefinition = "TEXT")
	private List<PointDTO> coordinates;

	@Column(name = "status")
	private String status;

	@Column(name = "type")
	private String type;

	@JsonIgnore
	@ManyToMany(mappedBy = "zones")
	private Set<Tracker> trackers = new HashSet<>();

	@Column(name = "fill_color")
	private String fillColor;

	@Column(name = "fill_opacity")
	private String fillOpacity;

	@Column(name = "stroke_color")
	private String strokeColor;

	@Column(name = "stroke_opacity")
	private String strokeOpacity;

	@Column(name = "stroke_weight")
	private String strokeWeight;

	@Column(name = "rule")
	private String rules;

	@Convert(converter = StringListConverter.class)
	@Column(name = "alert_to")
	private List<String> alertTo;

	@Column(name = "position_title")
	private String positionTitle;

}