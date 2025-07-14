package backend.dto.request;

import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateChallengeRequestDTO (
        @NotBlank String title,
        @NotBlank String description,
        String coverImageUrl,
        @Positive int points,
        @NotNull ChallengeCategory category,
        @NotNull ChallengeDifficulty difficulty
) {}
