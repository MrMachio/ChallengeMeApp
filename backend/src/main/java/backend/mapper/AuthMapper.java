package backend.mapper;

import backend.dto.keycloak.KeycloakTokenResponseDTO;
import backend.dto.response.AuthResponseDTO;
import backend.dto.response.TokenResponseDTO;
import backend.dto.response.UserResponseDTO;
import backend.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = {java.time.Instant.class})
public interface AuthMapper {

    // Keycloak ➜ backend -> frontend
    @Mapping(target = "expiresAt",
            expression = "java(Instant.now().plusSeconds(src.getExpiresIn() - 5))")
    @Mapping(target = "refreshExpiresAt",
            expression = "java(Instant.now().plusSeconds(src.getRefreshExpiresIn() - 5))")
    TokenResponseDTO toTokenDto(KeycloakTokenResponseDTO src);

    UserResponseDTO toUserDto(UserEntity entity);

    @Mapping(source = "user",   target = "user")
    @Mapping(source = "token",  target = "token")
    AuthResponseDTO toAuthDto(UserResponseDTO user, TokenResponseDTO token);
}