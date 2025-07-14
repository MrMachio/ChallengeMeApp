package backend.dto.response;

import backend.dto.CommentDTO;
import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ChallengeDetailsDTO(
        UUID id,
        String title,
        String description,
        String coverImageUrl,
        int points,
        ChallengeCategory category,
        ChallengeDifficulty difficulty,
        String authorId,
        String authorUsername,
        String authorAvatarUrl,
        int likesCount,
        int submissionsCount,
        OffsetDateTime createdAt,
        List<SubmissionSummaryDTO> submissions,
        List<CommentDTO> comments
) {}
