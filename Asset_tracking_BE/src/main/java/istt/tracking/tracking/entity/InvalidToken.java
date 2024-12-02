package istt.tracking.tracking.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "invalidToken")
public class InvalidToken {
	@Id
	private String id;
	private Date expiryTime;
	
	public InvalidToken(String id, Date expiryTime) {
		this.id = id;
		this.expiryTime = expiryTime;
	}
}
