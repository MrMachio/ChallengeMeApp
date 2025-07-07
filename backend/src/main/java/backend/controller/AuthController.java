package backend.controller;

import backend.service.KeycloakClient;
import backend.dto.LoginRequestDTO;
import backend.dto.LoginResponseDTO;
import backend.dto.RefreshRequestDTO;
import backend.dto.TokenResponseDTO;
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

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        TokenResponseDTO token = keycloakClient.getUserToken(loginRequest.getUsername(), loginRequest.getPassword());
        Instant now = Instant.now();
        return ResponseEntity.ok(new LoginResponseDTO(
                token.getAccessToken(),
                now.plusSeconds(token.getExpiresIn()),
                token.getRefreshToken(),
                now.plusSeconds(token.getRefreshExpiresIn())
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody RefreshRequestDTO request) {
        TokenResponseDTO token = keycloakClient.refreshUserToken(request);
        Instant now = Instant.now();
        return ResponseEntity.ok(new LoginResponseDTO(
                token.getAccessToken(),
                now.plusSeconds(token.getExpiresIn()),
                token.getRefreshToken(),
                now.plusSeconds(token.getRefreshExpiresIn())
        ));
    }
}
