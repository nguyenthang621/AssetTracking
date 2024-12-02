package istt.tracking.tracking.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import istt.tracking.tracking.utils.StringListConverter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "assets")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "users", "trackers" })
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Asset extends BaseModel implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "asset_id", updatable = false, nullable = false)
	private String assetId;

	@Column(name = "name_asset")
	private String nameAsset;

	@Column(name = "description")
	private String description;

	@Convert(converter = StringListConverter.class)
	@Column(name = "location")
	private List<String> location;

	@Convert(converter = StringListConverter.class)
	@Column(name = "images", columnDefinition = "TEXT")
	private List<String> images;

	@Column(name = "resolved_on")
	private Date resolvedOn;

	@Column(name = "resolved_by")
	private String resolvedBy;

	@Column(name = "location_position")
	private String locationPosition;

	@Column(name = "status")
	private String status;

	@Column(name = "alert")
	private String alert;

	@Column(name = "expired_arrival_date")
	private Date expiredArrivalDate;

	@Column(name = "destination", columnDefinition = "TEXT")
	private String destination;

	@JsonIgnore
	@ManyToMany(mappedBy = "assets", fetch = FetchType.LAZY)
	private Set<User> users = new HashSet<>();

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinTable(name = "asset_tracker", joinColumns = @JoinColumn(name = "asset_id"), inverseJoinColumns = @JoinColumn(name = "tracker_id"))
	private Set<Tracker> trackers = new HashSet<>();

	@Column(name = "arrived")
	private Boolean arrived;
	
	@Column(name = "arrived_at")
	private Date arrivedAt;
	
	@Override
	public int hashCode() {
		return Objects.hash(assetId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;
		Asset asset = (Asset) obj;
		return Objects.equals(assetId, asset.assetId);
	}

}