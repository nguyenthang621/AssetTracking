package istt.tracking.tracking.repository;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import istt.tracking.tracking.entity.Asset;
import istt.tracking.tracking.entity.Tracker;

public interface AssetRepo extends JpaRepository<Asset, String> {
	@Query("SELECT z from Asset z")
	List<Asset> getAll();
	
	@Query("SELECT a from Asset a where a.nameAsset = :x")
	Optional<Asset> existNameAsset(@Param("x") String x);
	
	@Query("SELECT a from Asset a where a.assetId = :x")
	Optional<Asset> findByAssetId(@Param("x") String x);
	
	
	@Query("SELECT a from Asset a where a.nameAsset like :x")
	List<Asset> findByNameAsset(@Param("x") String x);
	
	@Query("SELECT a FROM Asset a WHERE a.assetId in :ids")
	Optional<List<Asset>> findByAssetIds(@Param("ids") List<String> assetIds);
	
	@Query("SELECT b FROM Asset b JOIN b.trackers a")
    List<Asset> findAssetByTracker();
	
	@Query("SELECT count(b.assetId) FROM Asset b where ((b.createAt between :x and :y) or (b.updateAt between :x and :y)) and b.arrived = :z")
    Long totalAsset(@Param("x") Date startdate, @Param("y") Date enddate,@Param("z") Boolean arrived);
	
	@Query("SELECT AVG(EXTRACT(EPOCH FROM (b.arrivedAt - b.createAt))) as seconds FROM Asset b "
			+ "where b.arrivedAt !=null and b.createAt!=null "
			+ "and( (b.createAt between :x and :y) or (b.updateAt between :x and :y))"
			)
    Double turnTime(@Param("x") Date startdate, @Param("y") Date enddate);
	
	@Query("Select a from Asset a where a.nameAsset like :x and a.locationPosition like :y and a.status like :z")
	Page<Asset> searchAsset(@Param("x") String nameAsset,@Param("y") String locationPosition,@Param("z") String status ,Pageable pageable);
	
}
