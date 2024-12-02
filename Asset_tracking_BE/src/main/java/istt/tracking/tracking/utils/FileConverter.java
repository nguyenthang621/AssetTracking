package istt.tracking.tracking.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import io.jsonwebtoken.io.IOException;

public class FileConverter {
	//covertFile to byte
	static byte[] convertFileToByteArray(String filePath) throws IOException {
	    File file = new File(filePath);
	    try {
	    FileInputStream fileInputStream = new FileInputStream(file); 
	    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
	    byte[] buffer = new byte[1024];
	        for (int len; (len = fileInputStream.read(buffer)) != -1; ) {
	            byteArrayOutputStream.write(buffer, 0, len);
	        }
	        fileInputStream.close();
	        return byteArrayOutputStream.toByteArray();
	    }catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
