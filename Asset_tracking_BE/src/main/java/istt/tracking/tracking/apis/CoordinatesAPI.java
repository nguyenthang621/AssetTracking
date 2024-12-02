package istt.tracking.tracking.apis;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.AssestChart;
import istt.tracking.tracking.dto.CoordinatesDTO;
import istt.tracking.tracking.dto.CoordinatesDTO2;
import istt.tracking.tracking.dto.IAssestChart;
import istt.tracking.tracking.dto.ILocationChart;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.keyHistoryTracker;
import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.services.CoordinatesService;
import istt.tracking.tracking.utils.GPSUtils;
import istt.tracking.tracking.utils.utils.DateRange;

@RestController
@RequestMapping("/coordinates")
public class CoordinatesAPI {
	@Autowired
	private CoordinatesService coordinatesService;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private GPSUtils gpsUtils;

	private static final String ENTITY_NAME = "Coordinates";

	@PostMapping("")
	public ResponseDTO<CoordinatesDTO> create(@RequestBody @Valid CoordinatesDTO coordinatesDTO)
			throws URISyntaxException {
		boolean isMove = false;
		if (coordinatesDTO.getTracker().getTrackerId() == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}
		// Convert PointDTO to JTS Point
		if (coordinatesDTO.getPoint() != null) {
			Coordinate coord = new Coordinate(coordinatesDTO.getPoint().getLng(), coordinatesDTO.getPoint().getLat());

			Point point = new GeometryFactory().createPoint(coord);
			isMove = coordinatesService
					.create(Coordinates.builder().point(point).tracker(coordinatesDTO.getTracker()).build());
		} else {
			throw new BadRequestAlertException("Bad request: point data is missing", ENTITY_NAME, "missingPoint");
		}

		// Send CoordinatesDTO to another API
		String apiUrl = "http://localhost:5000/receiver_coordinates";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		coordinatesDTO.setMove(isMove); // isMove to set change real time on map
		HttpEntity<CoordinatesDTO> requestEntity = new HttpEntity<>(coordinatesDTO, headers);
		ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

		if (response.getStatusCode() == HttpStatus.OK) {
			return ResponseDTO.<CoordinatesDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
					.data(coordinatesDTO).build();
		} else {
			throw new RuntimeException("Failed to send data to the external API");
		}
	}

	@GetMapping("")
	public ResponseDTO<List<CoordinatesDTO>> getAll() {
		return ResponseDTO.<List<CoordinatesDTO>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.getAll()).build();
	}

	@GetMapping("/{trackerid}")
	public ResponseDTO<List<Coordinates>> getByTrackerId(@PathVariable(value = "trackerid") String trackerid)
			throws URISyntaxException {
		if (trackerid == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing_trackerid");
		}

		return ResponseDTO.<List<Coordinates>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.getCoordinatesByTrackerId(trackerid)).build();
	}

	@GetMapping("/history/{trackerid}")
	public ResponseDTO<Map<keyHistoryTracker, List<Coordinates>>> getHistoryByTrackerId(
			@PathVariable(value = "trackerid") String trackerid) throws URISyntaxException {
		if (trackerid == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing_trackerid");
		}

		return ResponseDTO.<Map<keyHistoryTracker, List<Coordinates>>>builder()
				.code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.genHistoryTracker(trackerid)).build();
	}

	@DeleteMapping("/ids")
	public ResponseDTO<List<String>> deletebyListId(@RequestBody @Valid List<String> ids) throws URISyntaxException {

		if (ids.isEmpty()) {
			throw new BadRequestAlertException("Bad request: missing coordinatess", ENTITY_NAME,
					"missing_coordinatess");
		}
		coordinatesService.deleteByIds(ids);
		return ResponseDTO.<List<String>>builder().code(String.valueOf(HttpStatus.OK.value())).data(ids).build();
	}

	@PutMapping("/")
	public ResponseDTO<CoordinatesDTO> update(@RequestBody @Valid CoordinatesDTO2 coordinatesDTO)
			throws URISyntaxException {
		return ResponseDTO.<CoordinatesDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.update(coordinatesDTO)).build();

	}

	@PostMapping("/test")
	public ResponseDTO<List<IAssestChart>> test(@RequestBody @Valid DateRange dateRange) throws URISyntaxException {
		return ResponseDTO.<List<IAssestChart>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.test(dateRange.getStartDate(), dateRange.getEndDate())).build();

	}

	// bang 2
	@PostMapping("/countLocation")
	public ResponseDTO<List<ILocationChart>> countLocation(@RequestBody @Valid DateRange dateRange)
			throws URISyntaxException {
		return ResponseDTO.<List<ILocationChart>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.location(dateRange.getStartDate(), dateRange.getEndDate())).build();

	}


	@PostMapping("/countAssestInZone")
	public ResponseDTO<List<AssestChart>> test3(@RequestBody @Valid DateRange dateRange)
			throws URISyntaxException {
		return ResponseDTO.<List<AssestChart>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(coordinatesService.countAssestInZone(dateRange.getStartDate(), dateRange.getEndDate())).build();

	}

}
