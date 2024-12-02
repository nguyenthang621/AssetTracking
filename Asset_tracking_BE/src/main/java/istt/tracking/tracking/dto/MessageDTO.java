package istt.tracking.tracking.dto;

import istt.tracking.tracking.entity.MessageType;
import lombok.Data;

@Data
public class MessageDTO {
	private String messageId;
	private MessageType messageType;
	private String content;
	private String room;
	private String username;
}
