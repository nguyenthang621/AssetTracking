package istt.tracking.tracking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import istt.tracking.tracking.entity.Tracker;

public interface TrackerRepo extends JpaRepository<Tracker, String> {

	@Query("SELECT z.trackerId, z.nameTracker, z.createAt, z.description, z.type, z.status from Tracker z")
	List<Tracker> getAll();
	
	@Query("SELECT a from Tracker a where a.nameTracker = :x")
	Optional<Tracker> existNameTracker(@Param("x") String x);
	
	@Query("SELECT a from Tracker a where a.trackerId = :x")
	Optional<Tracker> findByTrackerId(@Param("x") String x);
	
	
	@Query("SELECT a from Tracker a where a.nameTracker like :x")
	List<Tracker> findByNameTracker(@Param("x") String x);
	
	@Query("SELECT a from Tracker a where a.nameTracker = :x")
	Optional<Tracker> findTrackerByNameTracker(@Param("x") String x);
	
	@Query("SELECT a FROM Tracker a WHERE a.trackerId in :ids")
	Optional<List<Tracker>> findByTrackerIds(@Param("ids") List<String> trackerIds);

	@Query("Select a from Tracker a where a.nameTracker like :x and a.type like :y and a.status like :z")
	Page<Tracker> searchTracker(@Param("x") String nameTracker,@Param("y") String type,@Param("z") String status,Pageable pageable);
	
}
