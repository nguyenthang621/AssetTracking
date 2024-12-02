package istt.tracking.tracking.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.pdf.PdfWriter;

import istt.tracking.tracking.dto.MessageDTO;
import istt.tracking.tracking.dto.PdfResponse;
import istt.tracking.tracking.dto.TrackerDTO;
import istt.tracking.tracking.entity.Tracker;
import istt.tracking.tracking.entity.User;
import istt.tracking.tracking.repository.TrackerRepo;
import istt.tracking.tracking.repository.UserRepo;
import org.thymeleaf.spring5.SpringTemplateEngine;

public interface MailService {
	void sendEmail(TrackerDTO trackerDTO);
	
	void exportPDF();
}
@Service
class MailServiceImpl implements MailService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private SpringTemplateEngine templateEngine;
	
	@Autowired
	private TrackerRepo trackerRepo;
	
	@Autowired
	private UserRepo userRepo;

	
	@Async
	@Override
	public void sendEmail(TrackerDTO trackerDTO) {
		//kiem tra xem tracker thuoc user nao
		Tracker tracker = new Tracker();
		Optional<Tracker> trackerOp = trackerRepo.findById(trackerDTO.getTrackerId());
		if(trackerOp.isEmpty()) return;
		else {
			tracker = trackerOp.get(); 
		}
		try {
			MessageDTO mess = new MessageDTO();
			String trackerName = tracker.getNameTracker();
			String zoneName = "zone";
			String time = "time";
			String person = "person";
			String model ="model";
			String year = "year";
			String location = "location";
			String x ="x";
			String y ="y";
			String timeReport = "timeReport";
			
			Context context = new Context();
			context.setVariable("trackerName", trackerName);
			context.setVariable("zoneName", zoneName);
			context.setVariable("person", person);
			context.setVariable("model", model);
			context.setVariable("year", year);
			context.setVariable("location", location);
			context.setVariable("x", x);
			context.setVariable("y", y);
			context.setVariable("timeReport", timeReport);
			
			String html = templateEngine.process("email", context);
			
			MimeMessage email = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(email, StandardCharsets.UTF_8.name());
			
			helper.setTo("phamha03122003@gmail.com");
			helper.setText(html, true);
			helper.setSubject("New Alert for "+ trackerName);
			helper.setFrom("nthang621@gmail.com");
			javaMailSender.send(email);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@Override
	public void exportPDF() {
		try {
			Document document = new Document();
			PdfWriter.getInstance(document, new FileOutputStream("iTextHelloWorld.pdf"));
	
			document.open();
			Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
			Chunk chunk = new Chunk("Hello World", font);
			document.add(chunk);
			document.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	
	
}