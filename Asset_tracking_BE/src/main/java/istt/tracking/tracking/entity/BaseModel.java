package istt.tracking.tracking.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;

@MappedSuperclass
@Data
public abstract class BaseModel implements Serializable {

	@Column(name = "create_at")
	@CreationTimestamp
	private Date createAt;

	@Column(name = "update_at")
	private Date updateAt;

	@Column(name = "create_by")
	private String createBy;
}