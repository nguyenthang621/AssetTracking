package istt.tracking.tracking.repository;

import java.awt.print.Pageable;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import istt.tracking.tracking.entity.User;

public interface UserRepo extends JpaRepository<User, String>{

	Optional<User> findByUsername(String username);

//	@Query("SELECT u FROM User u WHERE u.username LIKE :x ")
//	Page<User> search(@Param("x") String value, Pageable pageable);

	@Query("SELECT u FROM User u WHERE u.userId = :x ")
	Optional<User> findByUserId(@Param("x") String s);
	

	Optional<User> findByAccessToken(String accesstoken);

//	@Query("SELECT u FROM User u ")
//	Page<User> getAll(@Param("x") String value, Pageable pageable);
	
}
