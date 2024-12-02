package istt.tracking.tracking.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import istt.tracking.tracking.dto.AssestChart;
import istt.tracking.tracking.dto.CoordinatesDTO;
import istt.tracking.tracking.dto.CoordinatesDTO2;
import istt.tracking.tracking.dto.IAssestChart;
import istt.tracking.tracking.dto.ILocationChart;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.dto.keyHistoryTracker;
import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.entity.Zone;
import istt.tracking.tracking.repository.CoordinatesRepo;
import istt.tracking.tracking.repository.ZoneRepo;
import istt.tracking.tracking.utils.GPSUtils;
import istt.tracking.tracking.utils.utils;

public interface CoordinatesService {
	boolean create(Coordinates coordinates);

	List<CoordinatesDTO> getAll();

	List<Coordinates> getCoordinatesByTrackerId(String trackerId);

	CoordinatesDTO update(CoordinatesDTO2 coordinatesDTO2);

	List<CoordinatesDTO> deleteByIds(List<String> ids);

	CoordinatesDTO get(String id);

	List<IAssestChart> test(Date startDate, Date endDate);

	List<ILocationChart> location(Date startDate, Date endDate);

	Map<keyHistoryTracker, List<Coordinates>> genHistoryTracker(String trackerId);
	
	List<AssestChart> countAssestInZone(Date startdate, Date endDate);

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
	private ZoneRepo zoneRepo;

	@Autowired
	private GPSUtils gpsUtils;

	@Override
	public boolean create(Coordinates coordinates) {
		try {
			System.out.println(coordinates.toString());

			String trackerId = coordinates.getTracker().getTrackerId();
			double lat = coordinates.getPoint().getY();
			double lng = coordinates.getPoint().getX();

			if (hazelcastService.compareDistance(trackerId, lat, lng, 0.05)) { // case > threshold (0.05km -> 50m)
																				// trường hợp di chuyển > ngưỡng (>50m)
				String coordinatesId = utils.genUUID();
				TrackerDTO trackerDTO = trackerService.getTrackerById(trackerId);
				Set<Zone> zones = trackerDTO.getZones();

				List<String> zoneSaveToHZ = null;
				if (zones.size() > 0) {
					double[] point = { lng, lat };
					Set<Zone> zonesInvaded = gpsUtils.isInsideZone(point, zones);
					if (zonesInvaded.size() > 0) {
						System.out.println("------------Đối tượng đã đi vào zone-------------");
						zoneSaveToHZ = zonesInvaded.stream().map((zoneInvaded) -> zoneInvaded.getZoneId())
								.collect(Collectors.toList());
						coordinates.setZoneEntered(zonesInvaded.stream().map((zoneInvaded) -> zoneInvaded.getZoneId())
								.collect(Collectors.toList()));
					}
				}

				coordinates.setCreateAt(new Date());
				coordinates.setLocation(gpsUtils.getLocation(coordinates));
				coordinates.setCoordinatesId(coordinatesId);

				coordinatesRepo.save(coordinates);
				hazelcastService.saveCoordinatesPrev(trackerId, coordinates);
				return true;
//				delete hazel prev
			} else { // di chuyển < 50m -> ko lưu và tính thời gian chờ (cập nhật updateAt -> tính
						// dwell time)
				Coordinates coordinatesPrev = hazelcastService.getPreviousCoordinates(trackerId);
				System.out.println("---->" + coordinatesPrev.toString());
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
		List<Coordinates> coordinates = coordinatesRepo.findAll();
		if(coordinates.size()==0) return new ArrayList<CoordinatesDTO>();
		return coordinates.stream().map(c -> new ModelMapper().map(c, CoordinatesDTO.class)).toList();
//		return null;
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
	public CoordinatesDTO update(CoordinatesDTO2 coordinatesDTO2) {
		try {
			ModelMapper modelMapper = new ModelMapper();
			Coordinates coordinates = coordinatesRepo.findById(coordinatesDTO2.getCoordinatesId()).orElseThrow(NoResultException::new);
			coordinates = modelMapper.map(coordinatesDTO2, Coordinates.class);
			coordinatesRepo.save(coordinates);
			return modelMapper.map(coordinates, CoordinatesDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<CoordinatesDTO> deleteByIds(List<String> ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CoordinatesDTO get(String id) {
		Coordinates coordinate = coordinatesRepo.findById(id).orElseThrow(NoResultException::new);
		return new ModelMapper().map(coordinate, CoordinatesDTO.class);
	}

	@Override
	public List<IAssestChart> test(Date startDate, Date endDate) {
		Optional<List<IAssestChart>> test = coordinatesRepo.test(startDate, endDate);
		if (test.isEmpty())
			return null;
		return test.get();
	}

	@Override
	public List<ILocationChart> location(Date startDate, Date endDate) {
		Optional<List<ILocationChart>> test = coordinatesRepo.test2(startDate, endDate);
		if (test.isEmpty())
			return null;
		return test.get();
	}

	@Override	
	public List<AssestChart> countAssestInZone(Date startdate, Date endDate) {
//		Map<String, Long> dictionary = new HashMap<String, Long>();
		List<AssestChart> asset = new ArrayList<AssestChart>();
		List<Zone> zone = zoneRepo.getAll();
		for (Zone zone2 : zone) {
			Long count = coordinatesRepo.countZoneEntered(startdate, endDate, zone2.getZoneId());
			asset.add(new AssestChart(zone2.getZoneId(), count));
		}
		return asset;
	}

	@Override
	public LinkedHashMap<keyHistoryTracker, List<Coordinates>> genHistoryTracker(String trackerId) {

		LinkedHashMap<keyHistoryTracker, List<Coordinates>> steps = new LinkedHashMap<>();
		LinkedHashMap<keyHistoryTracker, List<Coordinates>> result = new LinkedHashMap<>();
		List<Coordinates> coordinates = getCoordinatesByTrackerId(trackerId);
		for (Coordinates coordinate : coordinates) {
			keyHistoryTracker key = new keyHistoryTracker();
			if (coordinate.getLocation() != null && coordinate.getZoneEntered().size() > 0) {
				if (coordinate.getZoneEntered().get(0).length() > 0) {
					key.setType("LocationZone");
					key.setNameKey(List.of(coordinate.getLocation(), coordinate.getZoneEntered().toString()));
				} else {
					key.setType("Location");
					key.setNameKey(List.of(coordinate.getLocation()));
				}
			} else if (coordinate.getLocation() == null && coordinate.getZoneEntered().size() > 0) {
				if (coordinate.getZoneEntered().get(0).length() > 0) {
					key.setType("Zone");
					key.setNameKey(List.of(coordinate.getZoneEntered().toString()));
				} else {
					key.setType("InTransit");
					key.setNameKey(List.of(coordinate.getZoneEntered().toString()));
				}
			} else {
				key.setType("InTransit");
				key.setNameKey(List.of(coordinate.getLocation()));
			}

			// Ensure the order is preserved
			if (!steps.containsKey(key)) {
				steps.put(key, new ArrayList<>());
			}
			List<Coordinates> newHistoryTracker = steps.get(key);
			newHistoryTracker.add(coordinate);
			steps.put(key, newHistoryTracker);
		}

		// Iterate through the map to pick first and last coordinates
		for (Map.Entry<keyHistoryTracker, List<Coordinates>> entry : steps.entrySet()) {
			keyHistoryTracker key = entry.getKey();
			List<Coordinates> coordinatesList = entry.getValue();

			if (!coordinatesList.isEmpty()) {
				List<Coordinates> coordinatesListEntry = new ArrayList<>();

				coordinatesListEntry.add(coordinatesList.get(0)); // First element
				coordinatesListEntry.add(coordinatesList.get(coordinatesList.size() - 1));

				result.put(key, coordinatesListEntry);
			}
		}

		return result;
	}

}