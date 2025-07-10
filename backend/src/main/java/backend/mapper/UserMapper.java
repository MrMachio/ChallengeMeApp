package backend.mapper;

import backend.dto.keycloak.KeycloakCredentialDTO;
import backend.dto.keycloak.KeycloakRegisterRequestDTO;
import backend.dto.request.RegisterRequestDTO;
import backend.dto.response.UserResponseDTO;
import backend.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring", imports = {List.class})
public interface UserMapper {

    UserResponseDTO toDto(UserEntity entity);

    @Mapping(target = "id", source = "userId")
    UserEntity toEntity(UUID userId, RegisterRequestDTO dto);

    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "credentials",
            expression = "java(List.of(toCredential(dto.password())))")
    KeycloakRegisterRequestDTO toKeycloakDto(RegisterRequestDTO dto);

    @Mapping(target = "type",      constant = "password")
    @Mapping(target = "value",     source   = "password")
    @Mapping(target = "temporary", constant = "false")
    KeycloakCredentialDTO toCredential(String password);
}