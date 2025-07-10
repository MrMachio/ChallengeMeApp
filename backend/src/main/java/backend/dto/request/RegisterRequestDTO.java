package backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public record RegisterRequestDTO(
        @NotBlank String  username,
        @Email String  email,
        String  firstName,
        String  lastName,
        @Size(min = 3) String password
) {}
