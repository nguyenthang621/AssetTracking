package istt.tracking.tracking.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.map.IMap;

import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.utils.GPSUtils;

@Service
public class HazelcastService {

	private static final String COORDINATES_MAP = "coordinates-map";

	@Autowired
	private GPSUtils gpsUtils;

	@Autowired
	private HazelcastInstance hazelcastInstance;

	// Save coordinates into Hazelcast
//	public void saveCoordinates(String trackerId, PointHZ pointHZ) {
//		IMap<String, PointHZ> coordinatesMap = hazelcastInstance.getMap(COORDINATES_MAP);
//
//		coordinatesMap.put(trackerId, pointHZ);
//	}
//
//	// Query coordinates from Hazelcast
//	public PointHZ getPreviousCoordinates(String trackerId) {
//		IMap<String, PointHZ> coordinatesMap = hazelcastInstance.getMap(COORDINATES_MAP);
//		return coordinatesMap.get(trackerId);
//	}

	public void saveCoordinatesPrev(String trackerId, Coordinates coordinates) {
		IMap<String, Coordinates> coordinatesIdMap = hazelcastInstance.getMap(COORDINATES_MAP);
		String key = "HZ_trackerId_" + trackerId;
		coordinatesIdMap.put(key, coordinates);
	}

	// Query coordinatesId from Hazelcast
	public Coordinates getPreviousCoordinates(String trackerId) {
		IMap<String, Coordinates> coordinatesIdMap = hazelcastInstance.getMap(COORDINATES_MAP);
		String key = "HZ_trackerId_" + trackerId;
		return coordinatesIdMap.get(key);
	}

	// Check distance
	public boolean compareDistance(String trackerId, double newLat, double newLon, double distanceThreshold) {
		Coordinates previousCoordinates = getPreviousCoordinates(trackerId);
		if (previousCoordinates == null) {
			return true;
		}
		double previousLat = previousCoordinates.getPoint().getY();
		double previousLon = previousCoordinates.getPoint().getX();
		double distance = gpsUtils.calculateDistance(previousLat, previousLon, newLat, newLon);
		System.out.println("-------distance: " + distance);
		// save if distance > threshold

		if (distance > distanceThreshold) {
			return true;
		}
		return false;
	}
}
