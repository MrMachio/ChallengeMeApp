package backend.dto.response;

import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ChallengeSummaryDTO(
        UUID id,
        String title,
        String description,
        String coverImageUrl,
        int points,
        ChallengeCategory category,
        ChallengeDifficulty difficulty,
        String authorUsername,
        String authorAvatarUrl,
        int likesCount,
        int submissionsCount,
        OffsetDateTime createdAt
) {}
