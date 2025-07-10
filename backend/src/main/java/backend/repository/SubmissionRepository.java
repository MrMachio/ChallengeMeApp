package backend.repository;

import backend.model.SubmissionEntity;
import backend.model.enums.SubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<SubmissionEntity, UUID> {
    Page<SubmissionEntity> findByUserIdAndStatus(
            UUID userId,
            SubmissionStatus status,
            Pageable pageable);

    List<SubmissionEntity> findByChallengeIdAndStatus(
            UUID challengeId,
            SubmissionStatus status);
}
