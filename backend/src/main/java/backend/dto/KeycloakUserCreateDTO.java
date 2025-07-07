package backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KeycloakUserCreateDTO {
    private String username;
    private String email;
    private boolean enabled = true;
    private List<CredentialDTO> credentials;
}
