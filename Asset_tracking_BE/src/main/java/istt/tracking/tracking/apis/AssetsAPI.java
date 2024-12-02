package istt.tracking.tracking.apis;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import istt.tracking.tracking.dto.LocationUpdate;
import istt.tracking.tracking.dto.PointDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/assets")
@Slf4j
//@RequiredArgsConstructor
public class AssetsAPI {

//	private final SocketService socketService;
//	private final SocketIOServer socketIOServer;

//    @PostMapping("/coordinates")
//    public ResponseDTO<String> receiverCoordinates(@RequestBody @Valid Coordinates coordinates) {
//        System.out.println(coordinates.toString());
//        log.info("lat[{}] - long[{}] - username [{}]", coordinates.getLatitude(),
//                coordinates.getLongitude(), "user");
//        
//        
//        // Emit data to update_location topic
//        Message message = new Message();
//        message.setRoom("defaultRoom");
//        message.setContent("content");
//        message.setUsername("defaultUser");
//        socketIOServer.getAllClients().forEach(client -> 
////            socketService.emitLocationUpdate(client, coordinates)
//            socketService.sendSocketMessage(client, message, "defaultRoom")
//        );
//        
//        
//        return ResponseDTO.<String>builder()
//                .code(String.valueOf(HttpStatus.OK.value()))
//                .data("Oke")
//                .build();
//    }
	
//	------------------------------------------------------

//	private SocketIOServer server;
//	private List<Point> testZone = new ArrayList<>();
//
//	@Autowired
//	public void LocationController(SocketIOServer server) {
//		this.server = server;
//		this.server.addConnectListener(new ConnectListener() {
//			@Override
//			public void onConnect(SocketIOClient client) {
//				System.out.println("Client connected: " + client.getSessionId());
//			}
//		});
//
//		this.server.addDisconnectListener(new DisconnectListener() {
//			@Override
//			public void onDisconnect(SocketIOClient client) {
//				System.out.println("Client disconnected: " + client.getSessionId());
//			}
//		});
//
//		this.server.start();
//	}
//
//	@PostMapping("/coordinates")
//	public ResponseEntity<?> receiveCoordinates(@RequestBody Map<String, Double> data) {
//		double latitude = data.get("latitude");
//		double longitude = data.get("longitude");
//
//		boolean checkCurrentPoint = false;
//		String checkCurrentPointStr = "OUTSIDE";
//		if (!testZone.isEmpty()) {
//			Point point = new Point();
//			point.setLatitude(latitude);
//			point.setLongitude(longitude);
//			checkCurrentPoint = isPointInPolygon(point, testZone);
//			if (checkCurrentPoint) {
//				checkCurrentPointStr = "INSIDE";
//			}
//		}
//		LocationUpdate locationUpdate = new LocationUpdate();
//		locationUpdate.setLatitude(latitude);
//		locationUpdate.setLongitude(longitude);
//		locationUpdate.setInside(checkCurrentPointStr);
//		System.out.println(123123);
//		server.getBroadcastOperations().sendEvent("update_location", locationUpdate);
//
//		return ResponseEntity.ok("Location received successfully");
//	}
//
//	private boolean isPointInPolygon(Point point, List<Point> polygon) {
//
//		return false;
//	}

}