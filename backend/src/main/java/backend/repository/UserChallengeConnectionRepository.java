package backend.repository;

import backend.model.UserChallengeConnectionEntity;
import backend.model.enums.ConnectionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserChallengeConnectionRepository
        extends JpaRepository<UserChallengeConnectionEntity, UserChallengeConnectionEntity.Pk> {

    List<UserChallengeConnectionEntity> findByUserIdAndConnectionType(UUID userId, ConnectionType connectionType);

    List<UserChallengeConnectionEntity> findByUserIdAndChallengeId(UUID userId, UUID challengeId);

    List<UserChallengeConnectionEntity> findByChallengeIdAndConnectionType(UUID challengeId, ConnectionType connectionType);

    boolean existsByUserIdAndChallengeIdAndConnectionType(UUID userId, UUID challengeId, ConnectionType connectionType);
}
