package istt.tracking.tracking.entity;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tracker")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Tracker extends BaseModel implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "tracker_id")
	private String trackerId;

	@Column(name = "name_tracker")
	private String nameTracker;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "status")
	private String status;

	@Column(name = "type")
	private String type;
	
	@Column(name = "dataset")
	private String dataset;

	@JsonIgnore
	@ManyToMany(mappedBy = "trackers")
	private Set<Asset> assets = new HashSet<>();

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinTable(name = "tracker_zone", joinColumns = @JoinColumn(name = "tracker_id"), inverseJoinColumns = @JoinColumn(name = "zone_id"))
	private Set<Zone> zones = new HashSet<>();

	@OneToMany(mappedBy = "tracker", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@EqualsAndHashCode.Exclude
	@JsonManagedReference
	@ToString.Exclude
	@Transient  // loại bỏ trường này khi query
	private Collection<Coordinates> coordinates;

	@Override
	public String toString() {
		return "Tracker{id=" + trackerId + ", name='" + nameTracker + "'}";
	}

	@Override
	public int hashCode() {
		return Objects.hash(trackerId); // use only immutable fields, like ID
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;
		Tracker tracker = (Tracker) obj;
		return Objects.equals(trackerId, tracker.trackerId);
	}

}
