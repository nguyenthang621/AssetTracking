//package istt.tracking.tracking.services;
//
//import org.springframework.stereotype.Component;
//
//import com.corundumstudio.socketio.SocketIOServer;
//import com.corundumstudio.socketio.listener.ConnectListener;
//import com.corundumstudio.socketio.listener.DataListener;
//import com.corundumstudio.socketio.listener.DisconnectListener;
//
//import istt.tracking.tracking.entity.Message;
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@Slf4j
//public class SocketModule {
//
//	private final SocketIOServer server;
//	private final SocketService socketService;
//
//	public SocketModule(SocketIOServer server, SocketService socketService) {
//		this.server = server;
//		this.socketService = socketService;
//		server.addConnectListener(onConnected());
//		server.addDisconnectListener(onDisconnected());
//		server.addEventListener("send_message", Message.class, onChatReceived());
//
//	}
//
//	private DataListener<Message> onChatReceived() {
//		return (senderClient, data, ackSender) -> {
//			System.out.println(data.toString());
//			socketService.saveMessage(senderClient, data);
//		};
//	}
//
//	private ConnectListener onConnected() {
//		return (client) -> {
//			String room = client.getHandshakeData().getSingleUrlParam("room");
//			String username = client.getHandshakeData().getSingleUrlParam("room");
//			var params = client.getHandshakeData().getUrlParams();
////			String room = params.get("room").stream().collect(Collectors.joining());
////			String username = params.get("username").stream().collect(Collectors.joining());
//			System.out.println("room: " + room);
//			client.joinRoom(room);
//			System.out.println(client.getRemoteAddress());
////            socketService.saveInfoMessage(client, String.format(Constants.WELCOME_MESSAGE, username), room);
//			log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to chat module through",
//					client.getSessionId().toString(), room, username);
//		};
//
//	}
//
//	private DisconnectListener onDisconnected() {
//		return client -> {
//			var params = client.getHandshakeData().getUrlParams();
////			String room = params.get("room").stream().collect(Collectors.joining());
////			String username = params.get("username").stream().collect(Collectors.joining());
//			String room = client.getHandshakeData().getSingleUrlParam("room");
//			String username = client.getHandshakeData().getSingleUrlParam("room");
////            socketService.saveInfoMessage(client, String.format(Constants.DISCONNECT_MESSAGE, username), room);
//			log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through",
//					client.getSessionId().toString(), room, username);
//		};
//	}
//
//}
