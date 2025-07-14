package backend.repository;

import backend.model.ChallengeEntity;
import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface ChallengeRepository extends JpaRepository<ChallengeEntity, UUID>, JpaSpecificationExecutor<ChallengeEntity> {
    List<ChallengeEntity> findByCategoryAndDifficultyOrderByLikesCountDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty);

    List<ChallengeEntity> findByCategoryAndDifficultyOrderBySubmissionsCountDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty);

    List<ChallengeEntity> findByCategoryAndDifficultyOrderByPointsDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty);
}
