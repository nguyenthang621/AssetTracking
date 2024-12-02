//package istt.tracking.tracking.apis;
//
//import com.itextpdf.text.Document;
//import com.itextpdf.text.Paragraph;
//import com.itextpdf.text.pdf.PdfWriter;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import java.io.ByteArrayOutputStream;
//
//@RestController
//@RequestMapping("/test")
//public class TestAPI {
//
//    @GetMapping("/download-pdf")
//    public ResponseEntity<byte[]> downloadPdf() {
//        try {
//            // Tạo tài liệu PDF bằng iText
//            Document document = new Document();
//            ByteArrayOutputStream out = new ByteArrayOutputStream();
//            PdfWriter.getInstance(document, out);
//
//            document.open();
//            document.add(new Paragraph("Hello, đây là một file PDF ví dụ!"));
//            document.close();
//
//            // Chuyển dữ liệu PDF thành mảng byte
//            byte[] pdfBytes = out.toByteArray();
//
//            // Trả về PDF dưới dạng byte[]
//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Content-Disposition", "inline; filename=example.pdf");
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
//                    .body(pdfBytes);
//
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//}
//
