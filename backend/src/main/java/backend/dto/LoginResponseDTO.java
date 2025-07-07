package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private Instant expiresAt;
    private String refreshToken;
    private Instant refreshExpiresAt;
}

