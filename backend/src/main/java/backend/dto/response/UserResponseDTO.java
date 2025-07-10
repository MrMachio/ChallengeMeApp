package backend.dto.response;

import backend.dto.UserStatsDTO;
import java.time.OffsetDateTime;
import java.util.UUID;

public record UserResponseDTO (
        UUID id,
       String            username,
       String            email,
       String            firstName,
       String            lastName,
       String            bio,
       String            avatarUrl,
       OffsetDateTime    createdAt,
       UserStatsDTO      stats
) {}
