package istt.tracking.tracking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import istt.tracking.tracking.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

	List<Message> findAllByRoom(String room);
}
