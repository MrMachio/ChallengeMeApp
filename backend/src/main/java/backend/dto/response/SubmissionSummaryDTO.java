package backend.dto.response;

import backend.model.enums.SubmissionStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmissionSummaryDTO(
        UUID id,
        String proof,
        String description,
        SubmissionStatus status,
        // int rating,
        String authorUsername,
        String authorAvatarUrl,
        OffsetDateTime createdAt
) {}
