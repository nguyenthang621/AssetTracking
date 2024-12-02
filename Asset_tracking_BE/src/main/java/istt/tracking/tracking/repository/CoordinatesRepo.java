package istt.tracking.tracking.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import istt.tracking.tracking.dto.AssestChart;
import istt.tracking.tracking.dto.IAssestChart;
import istt.tracking.tracking.dto.ILocationChart;
import istt.tracking.tracking.entity.Coordinates;

@Repository
public interface CoordinatesRepo extends JpaRepository<Coordinates, String> {
	@Query("SELECT a from coordinates a where a.tracker.trackerId = :x ORDER BY a.createAt ASC")
	List<Coordinates> findByTrackerId(@Param("x") String x);

	@Query("SELECT a from coordinates a where a.coordinatesId = :x")
	Optional<Coordinates> findByCoordinatesId(@Param("x") String x);
	
	@Query("SELECT a from coordinates a where a.coordinatesId = :x")
	Optional<Coordinates> find(@Param("x") String x);
	
	@Query("SELECT a from coordinates a where a.zoneEntered != null and a.createAt between :y and :z ")
	Optional<List<Coordinates>> findIfEnterZoneNotNull(@Param("y") Date startdate, @Param("z") Date endDate);
	
	@Query("SELECT a.location as location, Count(a.createAt) as count from coordinates a where a.location != null and a.createAt between :y and :z "
			+ "GROUP BY a.location")
	Optional<List<IAssestChart>> test(@Param("y") Date startdate, @Param("z") Date endDate);
	
	@Query("SELECT a.location as location, AVG(EXTRACT(EPOCH FROM (a.updateAt - a.createAt))) as duration from coordinates a where a.location != null and a.updateAt != null and a.createAt != null "
			+ "GROUP BY a.location")
	Optional<List<ILocationChart>> test2(@Param("y") Date startdate, @Param("z") Date endDate);
	
	//tim ra cac zone co trong coordinate tu startdate den enddate
//	@Query("SELECT a from coordinates a where a.zoneEntered != '' and a.createAt between :y and :z")
//	Optional<List<Coordinates>> getZoneExist(@Param("y") Date startdate, @Param("z") Date endDate);
//	
//	@Query("SELECT a.zoneEntered from coordinates a where a.zoneEntered != '' and a.createAt between :y and :z")
//	List<String> getZone(@Param("y") Date startdate, @Param("z") Date endDate);
	
	@Query("SELECT Count(a.coordinatesId) from coordinates a where a.zoneEntered like %:x% and a.createAt between :y and :z ")
	Long countZoneEntered(@Param("y") Date startdate, @Param("z") Date endDate, @Param("x") String zoneEntered);
}

