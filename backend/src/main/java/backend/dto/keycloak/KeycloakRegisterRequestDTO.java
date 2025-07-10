package backend.dto.keycloak;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KeycloakRegisterRequestDTO {
    private String username;
    private String email;
    private boolean enabled = true;
    private List<KeycloakCredentialDTO> credentials;
}
