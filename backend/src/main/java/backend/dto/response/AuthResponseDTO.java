package backend.dto.response;

public record AuthResponseDTO(
    UserResponseDTO user,
    TokenResponseDTO token
) {};

