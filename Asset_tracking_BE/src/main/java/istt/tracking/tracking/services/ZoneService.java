package istt.tracking.tracking.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
import istt.tracking.tracking.dto.SearchZoneDTO;
import istt.tracking.tracking.dto.ZoneDTO;
import istt.tracking.tracking.entity.Zone;
import istt.tracking.tracking.repository.ZoneRepo;
import istt.tracking.tracking.utils.utils;

public interface ZoneService {
	ZoneDTO create(ZoneDTO ZoneDTO);

	List<ZoneDTO> getAll();

	ZoneDTO getZoneByZonename(String Zonename);

	ZoneDTO update(ZoneDTO ZoneDTO);

	List<ZoneDTO> deleteByIds(List<String> ids);

	ZoneDTO get(String id);
	
	ResponseDTO<List<ZoneDTO>> search(SearchZoneDTO searchZoneDTO);

}

@Service
@Transactional
class ZoneServiceImpl implements ZoneService {
	@Autowired
	private ZoneRepo zoneRepo;

	@Override
	public ZoneDTO create(ZoneDTO zoneDTO) {
		try {
			if (zoneRepo.existNameZone(zoneDTO.getNameZone()).isPresent()) {
				throw new BadRequestAlertException("Name Zone exist", "Zone",
						"Name Zone Exist");
			}
			Zone zone = new ModelMapper().map(zoneDTO, Zone.class);
			zone.setZoneId(utils.genUUID());
			zoneRepo.save(zone);
			return zoneDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<ZoneDTO> getAll() {
		// TODO Auto-generated method stub
		try {
			ModelMapper mapper = new ModelMapper();
			List<Zone> Zones = zoneRepo.findAll();
			if (Zones.size() < 0) return null;
			List<ZoneDTO> ZoneDTOs = Zones
					  .stream()
					  .map(Zone -> mapper.map(Zone, ZoneDTO.class))
					  .collect(Collectors.toList());
			return ZoneDTOs;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public ZoneDTO getZoneByZonename(String Zonename) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ZoneDTO update(ZoneDTO zoneDTO) {
		try {

			Zone zoneInDB = zoneRepo.findByZoneId(zoneDTO.getZoneId())
					.orElseThrow(NoResultException::new);
			
			if (zoneRepo.existNameZone(zoneDTO.getNameZone()).isPresent() && !zoneDTO.getNameZone().equals(zoneInDB.getNameZone())) {
				throw new BadRequestAlertException("Name Zone exist", "Zone",
						"Name Zone Exist");
			}
			
			Zone zone = new ModelMapper().map(zoneDTO, Zone.class);
			zone.setZoneId(zoneInDB.getZoneId());
			zone.setCreateAt(zoneInDB.getCreateAt());
			zone.setCreateBy(zoneInDB.getCreateBy());
			zoneRepo.save(zone);
			return new ModelMapper().map(zone, ZoneDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<ZoneDTO> deleteByIds(List<String> ids) {
		try {
			List<Zone> list = zoneRepo.findByZoneIds(ids).orElseThrow(NoResultException::new);

			if (!list.isEmpty()) {
				zoneRepo.deleteAllInBatch(list);
				return list.stream().map(zone -> new ModelMapper().map(zone, ZoneDTO.class))
						.collect(Collectors.toList());
			}
			throw new BadRequestAlertException("Zone empty", "Zone", "invalid");
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public ZoneDTO get(String id) {
		try {
			Zone zone = zoneRepo.findById(id).orElseThrow(NoResultException::new);
			return new ModelMapper().map(zone, ZoneDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public ResponseDTO<List<ZoneDTO>> search(SearchZoneDTO searchZoneDTO) {
		try {
			List<Sort.Order> orders = Optional.ofNullable(searchZoneDTO.getOrders()).orElseGet(Collections::emptyList)
					.stream().map(order -> {
						if (order.getOrder().equals(searchZoneDTO.ASC))
							return Sort.Order.asc(order.getProperty());

						return Sort.Order.desc(order.getProperty());
					}).collect(Collectors.toList());
			Pageable pageable = PageRequest.of(searchZoneDTO.getPage(), searchZoneDTO.getSize(), Sort.by(orders));

			Page<Zone> page = zoneRepo.searchZone(searchZoneDTO.getValue(), searchZoneDTO.getStatus(), pageable);
			
			ModelMapper mapper = new ModelMapper();
			List<ZoneDTO> zoneDTOs = page.getContent().stream()
					.map(day -> mapper.map(day, ZoneDTO.class)).collect(Collectors.toList());

			ResponseDTO<List<ZoneDTO>> responseDTO = mapper.map(page, ResponseDTO.class);
			responseDTO.setData(zoneDTOs);
			return responseDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

}