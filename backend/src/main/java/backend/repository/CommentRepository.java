package backend.repository;

import backend.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, UUID> {
    List<CommentEntity> findByChallengeIdOrderByCreatedAtAsc(UUID challengeId);
    List<CommentEntity> findByParentIdOrderByCreatedAtAsc(UUID parentCommentId);
}
