package istt.tracking.tracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.entity.InvalidToken;

public interface InvalidTokenRepo extends JpaRepository<InvalidToken, String> {

}
