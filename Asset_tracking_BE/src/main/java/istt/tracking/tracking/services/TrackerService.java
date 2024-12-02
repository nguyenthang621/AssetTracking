package istt.tracking.tracking.services;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.zalando.problem.Problem;
import org.zalando.problem.Status;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.SearchTrackerDTO;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.entity.Asset;
import istt.tracking.tracking.entity.Tracker;
import istt.tracking.tracking.entity.Zone;
import istt.tracking.tracking.repository.AssetRepo;
import istt.tracking.tracking.repository.TrackerRepo;
import istt.tracking.tracking.repository.ZoneRepo;

public interface TrackerService {
	TrackerDTO create(TrackerDTO trackerDTO);

	List<TrackerDTO> getAll();
	
	TrackerDTO getTrackerById(String trackerId);

	TrackerDTO getTrackerByTrackername(String trackername);

	TrackerDTO update(TrackerDTO trackerDTO);

	List<TrackerDTO> deleteByIds(List<String> ids);

	TrackerDTO get(String id);

	ResponseDTO<List<TrackerDTO>> search(SearchTrackerDTO searchTrackerDTO);
}

@Service
@Transactional
class TrackerServiceImpl implements TrackerService {

	@Autowired
	private TrackerRepo trackerRepo;

	@Autowired
	private AssetRepo assetRepo;
	
	@Autowired
	private ZoneRepo zoneRepo;

	@Override
	public TrackerDTO create(TrackerDTO trackerDTO) {
		try {
			if (trackerRepo.existNameTracker(trackerDTO.getNameTracker()).isPresent()) {
				throw new BadRequestAlertException("Name Tracker exist", "Tracker", "Name Tracker Exist");
			}
			Tracker tracker = new ModelMapper().map(trackerDTO, Tracker.class);

			if (trackerDTO.getAssets().size() > 0) {
				Set<Asset> assets = new HashSet<Asset>();
				for (Asset asset : trackerDTO.getAssets()) {
					Optional<Asset> assetOpt = assetRepo.findByAssetId(asset.getAssetId());
					if (assetOpt.isEmpty()) {
						throw new BadRequestAlertException("assetID not found", "asset", "Not found");
					}
					assets.add(assetOpt.get());
				}
				tracker.setAssets(assets);
			}
			
			if (trackerDTO.getZones().size() > 0) {
				Set<Zone> zoneList = new HashSet<Zone>();
				for (Zone zone: trackerDTO.getZones()) {
					Optional<Zone> zoneOpt = zoneRepo.findByZoneId(zone.getZoneId());
					if (zoneOpt.isEmpty()) {
						throw new BadRequestAlertException("ZoneID not found", "Zone",
								"Not found");
					}
					zoneList.add(zoneOpt.get());
				}
				tracker.setZones(zoneList);
			}
			trackerRepo.save(tracker);
			return trackerDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<TrackerDTO> getAll() {
		// TODO Auto-generated method stub
		try {
			ModelMapper mapper = new ModelMapper();
			List<Tracker> Trackers = trackerRepo.findAll();
			if (Trackers.size() < 0)
				return null;
			List<TrackerDTO> TrackerDTOs = Trackers.stream().map(Tracker -> mapper.map(Tracker, TrackerDTO.class))
					.collect(Collectors.toList());
			return TrackerDTOs;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public TrackerDTO getTrackerByTrackername(String Trackername) {
		try {
		Optional<Tracker> tracker = trackerRepo.findTrackerByNameTracker(Trackername);
		if(tracker.isEmpty()) return null;
		else return new ModelMapper().map(tracker.get(), TrackerDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public TrackerDTO update(TrackerDTO trackerDTO) {
		try {

			Tracker trackerInDB = trackerRepo.findByTrackerId(trackerDTO.getTrackerId())
					.orElseThrow(NoResultException::new);
			if (!trackerInDB.getNameTracker().equals(trackerDTO.getNameTracker())
					&& trackerRepo.existNameTracker(trackerDTO.getNameTracker()).isPresent()) {
				throw new BadRequestAlertException("Name Tracker exist", "Tracker", "Name Tracker Exist");
			}
			Tracker tracker = new ModelMapper().map(trackerDTO, Tracker.class);
			if (trackerDTO.getZones().size() > 0) {
				Set<Zone> zoneList = new HashSet<Zone>();
				for (Zone zone : trackerDTO.getZones()) {
					Optional<Zone> zoneOpt = zoneRepo.findByZoneId(zone.getZoneId());
					if (zoneOpt.isEmpty()) {
						throw new BadRequestAlertException("ZoneID not found", "Zone", "Not found");
					}
					zoneList.add(zoneOpt.get());
				}
				tracker.setZones(zoneList);
			}
			
			if (trackerDTO.getAssets().size() > 0) {
				Set<Asset> assets = new HashSet<Asset>();
				for (Asset asset : trackerDTO.getAssets()) {
					Optional<Asset> assetOpt = assetRepo.findByAssetId(asset.getAssetId());
					if (assetOpt.isEmpty()) {
						throw new BadRequestAlertException("assetID not found", "asset", "Not found");
					}
					assets.add(assetOpt.get());
				}
				tracker.setAssets(assets);
			}
			
			tracker.setTrackerId(trackerInDB.getTrackerId());
			tracker.setCreateAt(trackerInDB.getCreateAt());
			tracker.setCreateBy(trackerInDB.getCreateBy());
			trackerRepo.save(tracker);
			return new ModelMapper().map(tracker, TrackerDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<TrackerDTO> deleteByIds(List<String> ids) {
		try {
			List<Tracker> list = trackerRepo.findByTrackerIds(ids).orElseThrow(NoResultException::new);

			if (!list.isEmpty()) {
				trackerRepo.deleteAllInBatch(list);
				return list.stream().map(tracker -> new ModelMapper().map(tracker, TrackerDTO.class))
						.collect(Collectors.toList());
			}
			throw new BadRequestAlertException("Tracker empty", "Tracker", "invalid");
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public TrackerDTO get(String id) {
		try {
			Optional<Tracker> trackerOpt = trackerRepo.findByTrackerId(id);
			if (trackerOpt.isEmpty()) {
				throw new BadRequestAlertException("Tracker not found", "Tracker", "Not found");
			}

			return new ModelMapper().map(trackerOpt.get(), TrackerDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public TrackerDTO getTrackerById(String trackerId) {
		try {
			Optional<Tracker> trackerOpt = trackerRepo.findByTrackerId(trackerId);
			if (trackerOpt.isEmpty()) {
				throw new BadRequestAlertException("Tracker not found", "Tracker", "Not found");
			}

			return new ModelMapper().map(trackerOpt.get(), TrackerDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public ResponseDTO<List<TrackerDTO>> search(SearchTrackerDTO searchTrackerDTO) {
		try {
			List<Sort.Order> orders = Optional.ofNullable(searchTrackerDTO.getOrders()).orElseGet(Collections::emptyList)
					.stream().map(order -> {
						if (order.getOrder().equals(searchTrackerDTO.ASC))
							return Sort.Order.asc(order.getProperty());

						return Sort.Order.desc(order.getProperty());
					}).collect(Collectors.toList());
			Pageable pageable = PageRequest.of(searchTrackerDTO.getPage(), searchTrackerDTO.getSize(), Sort.by(orders));

			Page<Tracker> page = trackerRepo.searchTracker(searchTrackerDTO.getValue()
					, searchTrackerDTO.getType(), searchTrackerDTO.getStatus()
					, pageable);
			
			ModelMapper mapper = new ModelMapper();
			List<TrackerDTO> trackerDTOs = page.getContent().stream()
					.map(day -> mapper.map(day, TrackerDTO.class)).collect(Collectors.toList());

			ResponseDTO<List<TrackerDTO>> responseDTO = mapper.map(page, ResponseDTO.class);
			responseDTO.setData(trackerDTOs);
			return responseDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

}
