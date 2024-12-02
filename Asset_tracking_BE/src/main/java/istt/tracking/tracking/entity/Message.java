package istt.tracking.tracking.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class Message extends BaseModel {
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "message_id", updatable = false, nullable = false)
	private String messageId;

	@Enumerated(EnumType.STRING)
	private MessageType messageType;

	private String content;
	private String room;

	private String username;

}
