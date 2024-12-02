package istt.tracking.tracking.services;


import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
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

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.AssetDTO;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.SearchAssetDTO;
import istt.tracking.tracking.dto.TotalDTO;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.dto.UserDTO;
import istt.tracking.tracking.dto.ZoneDTO;
import istt.tracking.tracking.entity.Asset;
import istt.tracking.tracking.entity.Tracker;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.entity.Zone;
import istt.tracking.tracking.repository.AssetRepo;
import istt.tracking.tracking.repository.TrackerRepo;
import istt.tracking.tracking.repository.UserRepo;
import istt.tracking.tracking.repository.ZoneRepo;
import istt.tracking.tracking.utils.utils;
import istt.tracking.tracking.utils.utils.DateRange;

import org.zalando.problem.Problem;
import org.zalando.problem.Status;

public interface AssetService {
	AssetDTO create(AssetDTO AssetDTO);

	List<AssetDTO> getAll();

	AssetDTO getAssetByAssetname(String Assetname);

	AssetDTO update(AssetDTO AssetDTO);

	List<AssetDTO> deleteByIds(List<String> ids);

	AssetDTO get(String id);
	
	List<AssetDTO> getAssetPerZoneAtWeek(ZoneDTO zoneDTO);
	
	TotalDTO totalAsset(DateRange dateRange);
	
	ResponseDTO<List<AssetDTO>> search(SearchAssetDTO searchAssetDTO);
}

@Service
@Transactional
class AssetServiceImpl implements AssetService {
	@Autowired
	private AssetRepo assetRepo;
	
	@Autowired
	private TrackerRepo trackerRepo;
	
	@Autowired
	private ZoneRepo zoneRepo;
	
	@Autowired 
	private UserRepo userRepo;

	@Override
	public AssetDTO create(AssetDTO assetDTO) {
		try {
			if (assetRepo.existNameAsset(assetDTO.getNameAsset()).isPresent()) {
				throw new BadRequestAlertException("Name Asset exist", "Asset",
						"Name Asset Exist");
			}
			Asset asset = new ModelMapper().map(assetDTO, Asset.class);
			asset.setAssetId(utils.genUUID());
			if (assetDTO.getTrackers().size() > 0) {
				Set<Tracker> trackerList = new HashSet<Tracker>();
				for (Tracker tracker: assetDTO.getTrackers()) {
					Optional<Tracker> trackerOpt = trackerRepo.findByTrackerId(tracker.getTrackerId());
					System.out.println(trackerOpt.get().toString());
					if (trackerOpt.isEmpty()) {
						throw new BadRequestAlertException("TrackerID not found", "Tracker",
								"Not found");
					}
					trackerList.add(trackerOpt.get());
				}
				asset.setTrackers(trackerList);
			}
			
			if(assetDTO.getUsers().size()>0) {
				Set<User> users = new HashSet<User>();
				for (User user : users) {
					Optional<User> userOp = userRepo.findByUserId(user.getUserId());
					if (userOp.isEmpty()) {
						throw new BadRequestAlertException("UserID not found", "User",
								"Not found");
					}
					users.add(user);
				}
				asset.setUsers(users);
			}
		
			System.out.println(asset.toString());
			assetRepo.save(asset);
			return assetDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<AssetDTO> getAll() {
		try {
			ModelMapper mapper = new ModelMapper();
			List<Asset> assets = assetRepo.findAll();
			System.err.println(assets.size());
			if (assets.size() < 0) return null;
			List<AssetDTO> AssetDTOs = assets
					  .stream()
					  .map(Asset -> mapper.map(Asset, AssetDTO.class))
					  .collect(Collectors.toList());
			return AssetDTOs;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public AssetDTO getAssetByAssetname(String Assetname) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AssetDTO update(AssetDTO assetDTO) {
		try {

			Asset assetInDB = assetRepo.findByAssetId(assetDTO.getAssetId())
					.orElseThrow(NoResultException::new);
			if (!assetDTO.getNameAsset().equals(assetInDB.getNameAsset())) {
				if (assetRepo.existNameAsset(assetDTO.getNameAsset()).isPresent()) {
					throw new BadRequestAlertException("Name Asset exist", "Asset", "Name Asset Exist");
				}
			}
			
			Asset asset = new ModelMapper().map(assetDTO, Asset.class);
			
			if (assetDTO.getTrackers().size() > 0) {
				Set<Tracker> trackerList = new HashSet<Tracker>();
				for (Tracker tracker: assetDTO.getTrackers()) {
					Optional<Tracker> trackerOpt = trackerRepo.findByTrackerId(tracker.getTrackerId());
					System.out.println(trackerOpt.get().toString());
					if (trackerOpt.isEmpty()) {
						throw new BadRequestAlertException("TrackerID not found", "Tracker",
								"Not found");
					}
					trackerList.add(trackerOpt.get());
				}
				asset.setTrackers(trackerList);
			}
			
			if(assetDTO.getUsers().size()>0) {
				Set<User> users = new HashSet<User>();
				for (User user : users) {
					Optional<User> userOp = userRepo.findByUserId(user.getUserId());
					if (userOp.isEmpty()) {
						throw new BadRequestAlertException("UserID not found", "User",
								"Not found");
					}
					users.add(user);
				}
				asset.setUsers(users);
			}
			
			asset.setAssetId(assetInDB.getAssetId());
			asset.setCreateAt(assetInDB.getCreateAt());
			asset.setCreateBy(assetInDB.getCreateBy());
			asset.setUpdateAt(new Date());
			assetRepo.save(asset);
			return new ModelMapper().map(asset, AssetDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public List<AssetDTO> deleteByIds(List<String> ids) {
		try {
			List<Asset> list = assetRepo.findByAssetIds(ids).orElseThrow(NoResultException::new);
			if (!list.isEmpty()) {
				assetRepo.deleteAllInBatch(list);
				return list.stream().map(asset -> new ModelMapper().map(asset, AssetDTO.class))
						.collect(Collectors.toList());
			}
			throw new BadRequestAlertException("Asset empty", "Asset", "invalid");
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	@Override
	public AssetDTO get(String id) {
		try {
			Asset asset = assetRepo.findByAssetId(id).orElseThrow(NoResultException::new);

			
			return new ModelMapper().map(asset, AssetDTO.class);
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}

	//tim so assest vào zone trong 7 ngay qua
	@Override
	public List<AssetDTO> getAssetPerZoneAtWeek(ZoneDTO zoneDTO) {
		
		return null;
	}

	@Override
	public TotalDTO totalAsset(DateRange dateRange) {
		TotalDTO totalDTO = new TotalDTO();
		ModelMapper mapper = new ModelMapper();
		Long transit = assetRepo.totalAsset(dateRange.getStartDate(), dateRange.getEndDate(), false);
		Long des = assetRepo.totalAsset(dateRange.getStartDate(), dateRange.getEndDate(), true);
		Long total = transit+des;
		Double turntime = assetRepo.turnTime(dateRange.getStartDate(), dateRange.getEndDate());
		Double days = turntime/86400;
		totalDTO.setTimeID(dateRange.getStartDate().toString());
		totalDTO.setTotalAsset(total);
		totalDTO.setTransit(transit);
		totalDTO.setTurnTime(days);
		totalDTO.setDestination(des);
		return totalDTO;
	}

	@Override
	public ResponseDTO<List<AssetDTO>> search(SearchAssetDTO searchAssetDTO) {
		try {
			List<Sort.Order> orders = Optional.ofNullable(searchAssetDTO.getOrders()).orElseGet(Collections::emptyList)
					.stream().map(order -> {
						if (order.getOrder().equals(searchAssetDTO.ASC))
							return Sort.Order.asc(order.getProperty());

						return Sort.Order.desc(order.getProperty());
					}).collect(Collectors.toList());
			Pageable pageable = PageRequest.of(searchAssetDTO.getPage(), searchAssetDTO.getSize(), Sort.by(orders));

			Page<Asset> page = assetRepo.searchAsset(searchAssetDTO.getValue()
					, searchAssetDTO.getLocationPosition(), searchAssetDTO.getStatus()
					, pageable);
			
			ModelMapper mapper = new ModelMapper();
			List<AssetDTO> assetDTOs = page.getContent().stream()
					.map(day -> mapper.map(day, AssetDTO.class)).collect(Collectors.toList());

			ResponseDTO<List<AssetDTO>> responseDTO = mapper.map(page, ResponseDTO.class);
			responseDTO.setData(assetDTOs);
			return responseDTO;
		} catch (ResourceAccessException e) {
			throw Problem.builder().withStatus(Status.EXPECTATION_FAILED).withDetail("ResourceAccessException").build();
		} catch (HttpServerErrorException | HttpClientErrorException e) {
			throw Problem.builder().withStatus(Status.SERVICE_UNAVAILABLE).withDetail("SERVICE_UNAVAILABLE").build();
		}
	}
}