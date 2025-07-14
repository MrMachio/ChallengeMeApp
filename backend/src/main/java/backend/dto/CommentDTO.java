package backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CommentDTO(
        UUID id,
        String text,
        String authorUsername,
        String authorAvatarUrl,
        OffsetDateTime createdAt,
        UUID parentCommentId
) {
}
