package istt.tracking.tracking.dto;

import java.util.UUID;

import javax.persistence.Lob;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PdfResponse {
	private UUID fileId;
    private String fileName;
//    @Lob
    private byte[] pdfData;
    private Long size;
}
