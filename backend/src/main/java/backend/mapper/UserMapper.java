package backend.mapper;

import backend.dto.CredentialDTO;
import backend.dto.KeycloakUserCreateDTO;
import backend.dto.UserRequestDTO;
import backend.dto.UserResponseDTO;
import backend.model.UserEntity;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDTO toDto(UserEntity entity) {
        return UserResponseDTO.builder()
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .level(entity.getLevel())
                .points(entity.getPoints())
                .build();
    }

    public UserEntity toEntity(UUID userId, UserRequestDTO userRequestDTO) {
        return UserEntity.builder()
                .id(userId)
                .username(userRequestDTO.getUsername())
                .email(userRequestDTO.getEmail())
                .firstName(userRequestDTO.getFirstName())
                .lastName(userRequestDTO.getLastName())
                .build();
    }

    public KeycloakUserCreateDTO toKeycloakDto(UserRequestDTO request) {
        CredentialDTO credential = CredentialDTO.builder()
                .type("password")
                .value(request.getPassword())
                .temporary(false)
                .build();

        return KeycloakUserCreateDTO.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .enabled(true)
                .credentials(List.of(credential))
                .build();
    }
}
