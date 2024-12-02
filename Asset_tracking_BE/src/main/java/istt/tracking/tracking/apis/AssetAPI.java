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
import istt.tracking.tracking.dto.AssetDTO;
import istt.tracking.tracking.dto.ResponseDTO;
import istt.tracking.tracking.dto.SearchAssetDTO;
import istt.tracking.tracking.dto.TotalDTO;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.services.AssetService;
import istt.tracking.tracking.utils.utils.DateRange;

@RestController
@RequestMapping("/assets")
public class AssetAPI {
	@Autowired
	private AssetService assetService;
	
	private static final String ENTITY_NAME = "Asset";
	
	@PostMapping("")
	public ResponseDTO<AssetDTO> create(@RequestBody @Valid AssetDTO assetDTO) throws URISyntaxException {
		if ( assetDTO.getNameAsset() == null
				|| assetDTO.getResolvedBy() == null) {
			throw new BadRequestAlertException("Bad request: missing data", ENTITY_NAME, "missing");
		}

		assetService.create(assetDTO);
		return ResponseDTO.<AssetDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(assetDTO).build();
	}
	
	@GetMapping("")
    public ResponseDTO<List<AssetDTO>> getAll() {
		return ResponseDTO.<List<AssetDTO>>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(assetService.getAll()).build();
    }
	
	@DeleteMapping("/ids")
	public ResponseDTO<List<String>> deletebyListId(@RequestBody @Valid List<String> ids) throws URISyntaxException {

		if (ids.isEmpty()) {
			throw new BadRequestAlertException("Bad request: missing assets", ENTITY_NAME, "missing_assets");
		}
		assetService.deleteByIds(ids);
		return ResponseDTO.<List<String>>builder().code(String.valueOf(HttpStatus.OK.value())).data(ids).build();
	}
	
	
	@PutMapping("/")
	public ResponseDTO<AssetDTO> update(@RequestBody @Valid AssetDTO assetDTO) throws URISyntaxException {
		return ResponseDTO.<AssetDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(assetService.update(assetDTO)).build();

	}
	
	@GetMapping("/{assetId}")
	public ResponseDTO<AssetDTO> get(@PathVariable(value = "assetId") String assetId) {
		return ResponseDTO.<AssetDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(assetService.get(assetId))
				.build();
	}
	
	@PostMapping("/totalAssest")
	public ResponseDTO<TotalDTO> test(@RequestBody @Valid DateRange dateRange) throws URISyntaxException {
		return ResponseDTO.<TotalDTO>builder().code(String.valueOf(HttpStatus.OK.value())).success(true).data(assetService.totalAsset(dateRange)).build();

	}
	
	@PostMapping("/search")
	public ResponseDTO<List<AssetDTO>> search(@RequestBody @Valid SearchAssetDTO searchAssetDTO) throws URISyntaxException {
		return assetService.search(searchAssetDTO);
	}

}