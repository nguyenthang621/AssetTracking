package istt.tracking.tracking.apis;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;
import com.lowagie.text.Document;

import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.services.MailService;


@RestController
@RequestMapping("/email")
public class MailAPI {

	@Autowired
	private MailService mailService;

	@PostMapping("")
	public ResponseEntity<String> sendNotification(@RequestBody TrackerDTO trackerDTO) {
		try {
			
			mailService.sendEmail(trackerDTO);
			return ResponseEntity.status(HttpStatus.OK).body("Email sent successfully");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending email");

		}

	}
	

}

