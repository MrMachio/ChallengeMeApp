package backend.service;

import backend.dto.request.RegisterRequestDTO;
import backend.dto.response.UserResponseDTO;
import backend.exception.ConflictException;
import backend.exception.NotFoundException;
import backend.mapper.UserMapper;
import backend.model.UserEntity;
import backend.model.UserStatsEntity;
import backend.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
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

    public UserEntity findByAccessToken(String accessToken) {

        DecodedJWT jwt = JWT.decode(accessToken);
        UUID userId    = UUID.fromString(jwt.getSubject()); // SUB

        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No local user with id " + userId));
    }

    public UserResponseDTO createUser(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByUsername(registerRequestDTO.username())) {
            throw new ConflictException("Username is already in use");
        }

        if (registerRequestDTO.email() != null && userRepository.existsByEmail(registerRequestDTO.email())) {
            throw new ConflictException("Email is already in use");
        }

        UUID userId = keycloakClient.createUser(userMapper.toKeycloakDto(registerRequestDTO));

        UserEntity entity = userMapper.toEntity(userId, registerRequestDTO);

        UserStatsEntity stats = UserStatsEntity.builder()
                .userId(userId)
                .points(0)
                .createdChallengesCount(0)
                .completeChallengesCount(0)
                .activeChallengesCount(0)
                .savedChallengesCount(0)
                .submissionsCount(0)
                .build();
        entity.setStats(stats);

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
