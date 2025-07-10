package backend.controller;

import backend.dto.request.RegisterRequestDTO;
import backend.dto.response.TokenResponseDTO;
import backend.dto.response.UserResponseDTO;
import backend.mapper.AuthMapper;
import backend.model.UserEntity;
import backend.service.KeycloakClient;
import backend.dto.request.LoginRequestDTO;
import backend.dto.response.AuthResponseDTO;
import backend.dto.request.RefreshRequestDTO;
import backend.dto.keycloak.KeycloakTokenResponseDTO;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final KeycloakClient keycloakClient;
    private final AuthMapper authMapper;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {

        KeycloakTokenResponseDTO keycloakToken = keycloakClient.getUserToken(loginRequest.getUsername(), loginRequest.getPassword());

        UserEntity entity = userService.findByAccessToken(keycloakToken.getAccessToken());
        UserResponseDTO user = authMapper.toUserDto(entity);

        TokenResponseDTO token = authMapper.toTokenDto(keycloakToken);

        return ResponseEntity.ok(authMapper.toAuthDto(user, token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDTO> refresh(@RequestBody RefreshRequestDTO request) {
        KeycloakTokenResponseDTO keycloakToken = keycloakClient.refreshUserToken(request);
        return ResponseEntity.ok(authMapper.toTokenDto(keycloakToken));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO request) {

        UserResponseDTO user = userService.createUser(request);

        // Immediate login
        KeycloakTokenResponseDTO keycloakToken = keycloakClient.getUserToken(request.username(), request.password());
        TokenResponseDTO token = authMapper.toTokenDto(keycloakToken);

        return ResponseEntity.ok(authMapper.toAuthDto(user, token));
    }
}
