package backend.repository;

import backend.model.ChallengeEntity;
import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChallengeRepository extends JpaRepository<ChallengeEntity, UUID> {
    Page<ChallengeEntity> findByCategoryAndDifficultyOrderByLikesCountDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty,
            Pageable pageable);

    Page<ChallengeEntity> findByCategoryAndDifficultyOrderBySubmissionsCountDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty,
            Pageable pageable);

    Page<ChallengeEntity> findByCategoryAndDifficultyOrderByPointsDesc(
            ChallengeCategory category,
            ChallengeDifficulty difficulty,
            Pageable pageable);
}
