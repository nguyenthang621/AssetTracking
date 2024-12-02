package istt.tracking.tracking.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vividsolutions.jts.geom.Point;

import istt.tracking.tracking.services.PointSerializer;
import istt.tracking.tracking.utils.ListListDoubleConverter;
import istt.tracking.tracking.utils.StringListConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity(name = "coordinates")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coordinates implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "coordinates_id")
	private String coordinatesId;

	@Column(name = "dwell_time")
	private String dwellTime;

	@Column(name = "location", columnDefinition = "TEXT")
	private String location;

	@Convert(converter = StringListConverter.class)
	@Column(name = "zone_entered", columnDefinition = "TEXT")
	private List<String> zoneEntered;

	@NotNull
	@Column(name = "point")
	@JsonSerialize(using = PointSerializer.class)
	private Point point;
	
	
	
////	  @Type(type = "jsonb")
////	  @Convert(disableConversion = true)
////	  @Column(columnDefinition = "jsonb")
//	  
//	@Convert(converter = ListListDoubleConverter.class)
//	@Column(name = "coordinates", columnDefinition = "TEXT")
//	  private List<List<Double>> coordinates;

	@ManyToOne
	@JoinColumn(name = "tracker_id")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@JsonBackReference
	private Tracker tracker;

	@Column(name = "create_at")
	@CreationTimestamp
	private Date createAt;

	@Column(name = "update_at")
	private Date updateAt;

	@Column(name = "create_by")
	private String createBy;
}
