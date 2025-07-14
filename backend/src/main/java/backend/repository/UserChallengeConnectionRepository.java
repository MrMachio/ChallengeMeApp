package backend.repository;

import backend.model.UserChallengeConnectionEntity;
import backend.model.enums.ConnectionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface UserChallengeConnectionRepository
        extends JpaRepository<UserChallengeConnectionEntity, UserChallengeConnectionEntity.Pk> {

    @Modifying
    @Transactional
    int deleteByUserIdAndChallengeIdAndConnectionType(UUID userId, UUID challengeId, ConnectionType connectionType);

    List<UserChallengeConnectionEntity> findByUserIdAndConnectionType(UUID userId, ConnectionType connectionType);

    List<UserChallengeConnectionEntity> findByUserIdAndChallengeId(UUID userId, UUID challengeId);

    List<UserChallengeConnectionEntity> findByChallengeIdAndConnectionType(UUID challengeId, ConnectionType connectionType);

    boolean existsByUserIdAndChallengeIdAndConnectionType(UUID userId, UUID challengeId, ConnectionType connectionType);
}
