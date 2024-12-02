package istt.tracking.tracking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import istt.tracking.tracking.entity.Tracker;
import istt.tracking.tracking.entity.Zone;

public interface ZoneRepo extends JpaRepository<Zone, String> {

	@Query("SELECT z from Zone z")
	List<Zone> getAll();
	
	@Query("SELECT a from Zone a where a.nameZone = :x")
	Optional<Zone> existNameZone(@Param("x") String x);
	
	@Query("SELECT a from Zone a where a.zoneId = :x")
	Optional<Zone> findByZoneId(@Param("x") String x);
	
	
	@Query("SELECT a from Zone a where a.nameZone like :x")
	List<Zone> findByNameZone(@Param("x") String x);
	
	@Query("SELECT a FROM Zone a WHERE a.zoneId in :ids")
	Optional<List<Zone>> findByZoneIds(@Param("ids") List<String> zoneIds);

	@Query("Select a from Zone a where a.nameZone like :x and a.status like :z")
	Page<Zone> searchZone(@Param("x") String nameTracker,@Param("z") String status,Pageable pageable);
	
}
