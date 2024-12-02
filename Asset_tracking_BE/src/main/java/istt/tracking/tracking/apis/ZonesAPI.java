package istt.tracking.tracking.apis;

import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.SearchZoneDTO;
import istt.tracking.tracking.dto.ZoneDTO;
import istt.tracking.tracking.services.ZoneService;

@RestController
@RequestMapping("/zones")
public class ZonesAPI {
	@Autowired
	private ZoneService zoneService;

	private static final String ENTITY_NAME = "Zone";

	@PostMapping("")
	public ResponseDTO<ZoneDTO> create(@RequestBody @Valid ZoneDTO zoneDTO) throws URISyntaxException {
		if (zoneDTO.getCoordinates().size() == 0 || zoneDTO.getNameZone() == null || zoneDTO.getType() == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}

		zoneService.create(zoneDTO);
		return ResponseDTO.<ZoneDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(zoneDTO)
				.build();
	}

	@GetMapping("")
	public ResponseDTO<List<ZoneDTO>> getAll() {
		return ResponseDTO.<List<ZoneDTO>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(zoneService.getAll()).build();
	}

	@DeleteMapping("/ids")
	public ResponseDTO<List<String>> deletebyListId(@RequestBody @Valid List<String> ids) throws URISyntaxException {

		if (ids.isEmpty()) {
			throw new BadRequestAlertException("Bad request: missing zones", ENTITY_NAME, "missing_zones");
		}
		zoneService.deleteByIds(ids);
		return ResponseDTO.<List<String>>builder().code(String.valueOf(HttpStatus.OK.value())).data(ids).build();
	}

	@PutMapping("/")
	public ResponseDTO<ZoneDTO> update(@RequestBody @Valid ZoneDTO zoneDTO) throws URISyntaxException {
		return ResponseDTO.<ZoneDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(zoneService.update(zoneDTO)).build();

	}
	
	@PostMapping("/search")
	public ResponseDTO<List<ZoneDTO>> search(@RequestBody @Valid SearchZoneDTO searchZoneDTO) throws URISyntaxException {
		return zoneService.search(searchZoneDTO);
	}

}
