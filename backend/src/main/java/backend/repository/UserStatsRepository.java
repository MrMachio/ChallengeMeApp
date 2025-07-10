package backend.repository;

import backend.model.UserStatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserStatsRepository extends JpaRepository<UserStatsEntity, UUID> {

}
