package backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
   // @NotBlank
    private String username;
    //@NotBlank
    private String password;
    private String email;
    private String firstName;
    private String lastName;
}
