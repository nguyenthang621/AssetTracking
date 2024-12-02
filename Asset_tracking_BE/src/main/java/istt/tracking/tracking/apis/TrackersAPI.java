package istt.tracking.tracking.apis;

import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import istt.tracking.tracking.apis.errors.BadRequestAlertException;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.SearchTrackerDTO;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.dto.UserDTO;
import istt.tracking.tracking.services.TrackerService;

@RestController
@RequestMapping("/trackers")
public class TrackersAPI {
	@Autowired
	private TrackerService trackerService;

	private static final String ENTITY_NAME = "Tracker";

	@PostMapping("")
	public ResponseDTO<TrackerDTO> create(@RequestBody @Valid TrackerDTO trackerDTO) throws URISyntaxException {
		if (trackerDTO.getNameTracker() == null || trackerDTO.getTrackerId() == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}

		trackerService.create(trackerDTO);
		return ResponseDTO.<TrackerDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(trackerDTO).build();
	}
	
	@PostMapping("/search")
	public ResponseDTO<List<TrackerDTO>> search(@RequestBody @Valid SearchTrackerDTO searchTrackerDTO) throws URISyntaxException {
		return trackerService.search(searchTrackerDTO);
	}

	@GetMapping("")
	public ResponseDTO<List<TrackerDTO>> getAll() {
		return ResponseDTO.<List<TrackerDTO>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(trackerService.getAll()).build();
	}

	@DeleteMapping("/ids")
	public ResponseDTO<List<String>> deletebyListId(@RequestBody @Valid List<String> ids) throws URISyntaxException {

		if (ids.isEmpty()) {
			throw new BadRequestAlertException("Bad request: missing trackers", ENTITY_NAME, "missing_trackers");
		}
		trackerService.deleteByIds(ids);
		return ResponseDTO.<List<String>>builder().success(true).code(String.valueOf(HttpStatus.OK.value())).data(ids).build();
	}
	
	@GetMapping("/{trackerId}")
	public ResponseDTO<TrackerDTO> get(@PathVariable(value = "trackerId") String trackerId) {
		return ResponseDTO.<TrackerDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(trackerService.getTrackerById(trackerId))
				.build();
	}

	@PutMapping("/")
	public ResponseDTO<TrackerDTO> update(@RequestBody @Valid TrackerDTO trackerDTO) throws URISyntaxException {
		return ResponseDTO.<TrackerDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true)
				.data(trackerService.update(trackerDTO)).build();

	}

}
