package backend.dto.keycloak;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KeycloakTokenRequestDTO {
    private String grant_type;
    private String client_id;
    private String client_secret;
    private String username;
    private String password;
}
