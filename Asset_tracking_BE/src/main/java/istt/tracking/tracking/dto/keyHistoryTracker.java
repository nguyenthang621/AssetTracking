package istt.tracking.tracking.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class keyHistoryTracker {
	private String type;
	private List<String> nameKey;
}
