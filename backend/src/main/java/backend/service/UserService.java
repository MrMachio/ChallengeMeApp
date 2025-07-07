package backend.service;

import backend.dto.UserRequestDTO;
import backend.dto.UserResponseDTO;
import backend.exception.ConflictException;
import backend.exception.NotFoundException;
import backend.mapper.UserMapper;
import backend.model.UserEntity;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final KeycloakClient keycloakClient;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
            throw new ConflictException("Username is already in use");
        }

        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new ConflictException("Email is already in use");
        }

        UUID userId = keycloakClient.createUser(userMapper.toKeycloakDto(userRequestDTO));

        UserEntity entity = userMapper.toEntity(userId, userRequestDTO);
        UserEntity saved = userRepository.save(entity);

        log.info("User with username {} has been successfully created", saved.getUsername());

        return userMapper.toDto(saved);
    }

    public void deleteUser(UUID userId) {
        if(!userRepository.existsById(userId)) {
            log.info("User with ID {} not found", userId);
            throw new NotFoundException("User with ID " + userId + " not found");
        }

        keycloakClient.deleteUser(userId);
        userRepository.deleteById(userId);
        log.info("User with ID {} has been successfully deleted", userId);
    }
}
