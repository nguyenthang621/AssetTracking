package istt.tracking.tracking.services;

import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOClient;

import istt.tracking.tracking.dto.CoordinatesDTO;
import istt.tracking.tracking.entity.Message;
import istt.tracking.tracking.entity.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {

	private final MessageService messageService;

	public void sendSocketMessage(SocketIOClient senderClient, Message message, String room) {
		for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
			if (!client.getSessionId().equals(senderClient.getSessionId())) {
//				client.sendEvent("read_message", message);
				client.sendEvent("update_location", message);
			}
		}
	}

	public void emitLocationUpdate(SocketIOClient client, CoordinatesDTO coordinates) {
		System.out.println(123123);
		System.err.println(client.getNamespace());

		boolean isInRoom = client.getAllRooms().contains("defaultRoom");

		if (isInRoom) {
			System.out.println("sending message");
			client.sendEvent("update_location", coordinates);
		} else {
			System.err.println("Client is not in the defaultRoom");
		}
//		// Emit the event only to the clients connected in the "defaultRoom"
//		client.getNamespace().getRoomOperations("defaultRoom").getClients()
//				.forEach(c -> c.sendEvent("update_location", coordinates));
	}

	public void saveMessage(SocketIOClient senderClient, Message message) {
		System.out.println(1);
		Message storedMessage = messageService.saveMessage(Message.builder().messageType(MessageType.CLIENT)
				.content(message.getContent()).room(message.getRoom()).username(message.getUsername()).build());
		sendSocketMessage(senderClient, storedMessage, message.getRoom());
	}

	public void saveInfoMessage(SocketIOClient senderClient, String message, String room) {
		System.out.println(2);
		Message storedMessage = messageService
				.saveMessage(Message.builder().messageType(MessageType.SERVER).content(message).room(room).build());
		sendSocketMessage(senderClient, storedMessage, room);
	}
}
