package istt.tracking.tracking.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import istt.tracking.tracking.dto.CoordinatesDTO;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.entity.Zone;
import istt.tracking.tracking.repository.CoordinatesRepo;
import istt.tracking.tracking.utils.GPSUtils;
import istt.tracking.tracking.utils.utils;

public interface CoordinatesService {
	boolean create(Coordinates coordinates);

	List<CoordinatesDTO> getAll();

	List<Coordinates> getCoordinatesByTrackerId(String trackerId);

	CoordinatesDTO update(CoordinatesDTO coordinatesDTO);

	List<CoordinatesDTO> deleteByIds(List<String> ids);

	CoordinatesDTO get(String id);

}

@Service
@Transactional
class CoordinatesServiceImpl implements CoordinatesService {

	@Autowired
	private CoordinatesRepo coordinatesRepo;

	@Autowired
	private HazelcastService hazelcastService;

	@Autowired
	private TrackerService trackerService;

	@Autowired
	private GPSUtils gpsUtils;

	@Override
	public boolean create(Coordinates coordinates) {
		try {
			System.out.println(coordinates.toString());

			String trackerId = coordinates.getTracker().getTrackerId();
			double lat = coordinates.getPoint().getY();
			double lng = coordinates.getPoint().getX();

			List<String> zoneSaveToHZ = null;
			if (hazelcastService.compareDistance(trackerId, lat, lng, 0.05)) { // case > threshold (0.05km -> 50m)
																				// trường hợp di chuyển > ngưỡng (>50m)
				Coordinates coordinatesPrev = hazelcastService.getPreviousCoordinates(trackerId);
				System.out.println(0);
				String coordinatesId = utils.genUUID();
				TrackerDTO trackerDTO = trackerService.getTrackerById(trackerId);
				System.out.println(1);
				Set<Zone> zones = trackerDTO.getZones();
				System.out.println(2);
				if (zones.size() > 0) {
					double[] point = { lng, lat };
					Set<Zone> zonesInvaded = gpsUtils.isInsideZone(point, zones);
					if (zonesInvaded.size() > 0) {
						System.out.println("------------Đối tượng đã đi vào zone-------------");
						zoneSaveToHZ = zonesInvaded.stream().map((zoneInvaded) -> zoneInvaded.getZoneId())
								.collect(Collectors.toList());
						coordinates.setZoneEntered(zoneSaveToHZ);
					}
				}

				coordinates.setCoordinatesId(coordinatesId);
				coordinates.setCreateAt(new Date());
				coordinates.setLocation(gpsUtils.getLocation(coordinates));
				
				System.out.println("1. coordinatesPrev:  "+ coordinatesPrev);
				// Trường hợp điểm bắt đầu
				if (coordinatesPrev == null) {
					List<List<Double>> points = List.of(List.of(lng, lat));
					coordinates.setCoordinates(points);

				} else { // Các điểm tiếp theo
					System.out.println("Các điểm tiếp theo");
					List<List<Double>> newCoordinates = coordinatesPrev.getCoordinates();
					newCoordinates.add(List.of(lng, lat));
					coordinates.setCoordinates(newCoordinates);

					if (!coordinatesPrev.getLocation().equals(coordinates.getLocation())
							|| !zoneSaveToHZ.equals(coordinatesPrev.getZoneEntered())) {
						coordinatesRepo.save(coordinates);
					}
				}

//				coordinates.setCreateAt(new Date());
//				coordinates.setLocation(gpsUtils.getLocation(coordinates));
//				coordinates.setCoordinatesId(coordinatesId);
//			
//				coordinatesRepo.save(coordinates);
				hazelcastService.saveCoordinatesPrev(trackerId, coordinates);
				return true;
//				delete hazel prev
			} else { // di chuyển < 50m -> ko lưu và tính thời gian chờ (cập nhật updateAt -> tính
						// dwell time)
				Coordinates coordinatesPrev = hazelcastService.getPreviousCoordinates(trackerId);
				System.out.println("PREV---->" + coordinatesPrev.toString());
				if (coordinatesPrev != null) {
					Date lastUpdateAt = coordinatesPrev.getUpdateAt();

					// If dwell time > 1m -> update createAt and lookup location
					Calendar calendar = Calendar.getInstance();
					calendar.add(Calendar.MINUTE, -1);
					Date timeDwellThreshold = calendar.getTime();

					String location = coordinatesPrev.getLocation();
					if (lastUpdateAt != null && lastUpdateAt.before(timeDwellThreshold)) { // Case đã có updateTime
						// nếu location null hoặc chưa được tìm nâng cao -> lookup advance
						if (location == null || location.indexOf(",") == -1
								|| location.indexOf(",") != -1 && location.indexOf(",") == location.lastIndexOf(",")) {
							location = gpsUtils.getAddressDetail(lat, lng);
						}

						coordinatesPrev.setLocation(location);
						coordinatesPrev.setUpdateAt(new Date());
						hazelcastService.saveCoordinatesPrev(trackerId, coordinatesPrev);
						coordinatesRepo.save(coordinatesPrev);
						System.out.println("2. Updated updateAt: " + coordinatesPrev.toString());
					} else { // nếu updateAt null -> thời gian dừng đầu -> lookup location
						if (coordinatesPrev.getCreateAt().before(timeDwellThreshold)) {
							if (location == null || location.indexOf(",") == -1 || location.indexOf(",") != -1
									&& location.indexOf(",") == location.lastIndexOf(",")) {
								System.out.println("=================== lookup detail================================");
								location = gpsUtils.getAddressDetail(lat, lng);
							}
						} else {
							location = gpsUtils.getLocation(coordinates);
						}

						coordinatesPrev.setLocation(location);
						coordinatesPrev.setUpdateAt(new Date());
						hazelcastService.saveCoordinatesPrev(trackerId, coordinatesPrev);
						coordinatesRepo.save(coordinatesPrev);
						System.out.println("1. Updated first one: " + coordinatesPrev.toString());
					}
				}

			}
			return false;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<CoordinatesDTO> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Coordinates> getCoordinatesByTrackerId(String trackerId) {
		try {
			List<Coordinates> listCoordinates = coordinatesRepo.findByTrackerId(trackerId);
			return listCoordinates;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public CoordinatesDTO update(CoordinatesDTO coordinatesDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<CoordinatesDTO> deleteByIds(List<String> ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CoordinatesDTO get(String id) {
		// TODO Auto-generated method stub
		return null;
	}

}