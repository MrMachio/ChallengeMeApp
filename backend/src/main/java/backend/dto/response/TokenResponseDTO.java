package backend.dto.response;

import java.time.Instant;

public record TokenResponseDTO(
        String  accessToken,
        Instant expiresAt,
        String  refreshToken,
        Instant refreshExpiresAt
) {
}
