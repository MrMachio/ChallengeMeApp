package backend.service;

import backend.config.KeycloakConfigProperties;
import backend.dto.keycloak.KeycloakRegisterRequestDTO;
import backend.dto.request.RefreshRequestDTO;
import backend.dto.keycloak.KeycloakTokenResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakClient {

    private final WebClient webClient;
    private final KeycloakConfigProperties keycloakProps;

    private String cachedAdminToken;
    private Instant adminTokenExpiry;

    public KeycloakTokenResponseDTO getUserToken(String username, String password) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type",     "password");
        form.add("client_id",      keycloakProps.getClientId());
        form.add("client_secret",  keycloakProps.getClientSecret());
        form.add("username",       username);
        form.add("password",       password);

        try {
            ResponseEntity<KeycloakTokenResponseDTO> response = webClient.post()
                    .uri(keycloakProps.getTokenEndpoint())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(form)
                    .retrieve()
                    .toEntity(KeycloakTokenResponseDTO.class)
                    .block();

            if (response == null || response.getBody() == null) {
                log.error("No response from Keycloak while requesting token for {}", username);
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No response from Keycloak");
            }

            log.info("Successfully issued a new token for user: {} -> {}", username, response.getBody().getAccessToken());
            return response.getBody();

        } catch (WebClientResponseException e) {
            log.warn("Keycloak login failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString(), e);
        } catch (WebClientRequestException ex) {
            log.error("Could not reach Keycloak for issuing a new user token: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable", ex);
        }
    }


    public KeycloakTokenResponseDTO refreshUserToken(RefreshRequestDTO refreshToken) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "refresh_token");
        form.add("client_id", keycloakProps.getClientId());
        form.add("client_secret", keycloakProps.getClientSecret());
        form.add("refresh_token", refreshToken.getRefreshToken());

        try {
            ResponseEntity<KeycloakTokenResponseDTO> response = webClient.post()
                    .uri(keycloakProps.getTokenEndpoint())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(form)
                    .retrieve()
                    .toEntity(KeycloakTokenResponseDTO.class)
                    .block();

            if (response == null || response.getBody() == null) {
                log.error("No response from Keycloak while refreshing token");
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No response from Keycloak");
            }

            log.info("Successfully refreshed token for refreshToken ending with: {}",
                    refreshToken.getRefreshToken().substring(Math.max(0, refreshToken.getRefreshToken().length() - 6)));

            return response.getBody();
        } catch (WebClientResponseException e) {
            log.warn("Keycloak token refresh failed: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString(), e);
        } catch (WebClientRequestException ex) {
            log.error("Could not reach Keycloak for refreshing user token: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable", ex);
        }
    }


    public KeycloakTokenResponseDTO getClientToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", keycloakProps.getClientId());
        form.add("client_secret", keycloakProps.getClientSecret());

        try {
            ResponseEntity<KeycloakTokenResponseDTO> response = webClient.post()
                    .uri(keycloakProps.getTokenEndpoint())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(form)
                    .retrieve()
                    .toEntity(KeycloakTokenResponseDTO.class)
                    .block();

            if (response == null || response.getBody() == null) {
                log.error("No response from Keycloak while getting a new client token");
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No response from Keycloak");
            }
            return response.getBody();
        } catch (WebClientResponseException e) {
            log.error("Keycloak responded with status {} and body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                cachedAdminToken = null;
                adminTokenExpiry = null;
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable (unauthorized)", e);
            }
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString(), e);
        }
        catch (WebClientRequestException ex) {
            log.error("Could not reach Keycloak for getting client token: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable", ex);
        }

    }

    private String getAdminAccessToken() {
        if (cachedAdminToken != null && adminTokenExpiry != null && Instant.now().isBefore(adminTokenExpiry)) {
            return cachedAdminToken;
        }
        log.info("Admin token is null or expired => getting a new one");
        KeycloakTokenResponseDTO newAdminToken = getClientToken();
        cachedAdminToken = newAdminToken.getAccessToken();
        adminTokenExpiry = Instant.now().plusSeconds(newAdminToken.getExpiresIn());
        log.info("Admin token expires at: {}", adminTokenExpiry);
        return newAdminToken.getAccessToken();
    }

    public UUID createUser(KeycloakRegisterRequestDTO user) {
        String adminToken = getAdminAccessToken();

        try {
            ResponseEntity<Void> response = webClient.post()
                    .uri(keycloakProps.getUserEndpoint())
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(user)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            if (response == null) {
                log.error("No response from keycloak while trying to create a user [{}]", user.getUsername());
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No response from Keycloak");
            }
            URI location = response.getHeaders().getLocation();
            if (location == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Missing Location header from Keycloak");
            }
            String[] pathSegments = location.getPath().split("/");
            String userId = pathSegments[pathSegments.length - 1];

            log.info("User with username {} and ID {} has been successfully created in Keycloak", user.getUsername(), userId);
            return UUID.fromString(userId);

        } catch (WebClientResponseException ex) {
            log.error("Keycloak responded with status {} and body: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
        } catch (WebClientRequestException ex) {
            log.error("Could not reach Keycloak for user creation: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable", ex);
        }
    }

    public boolean deleteUser(UUID userId) {
        String adminToken = getAdminAccessToken();

        String deleteUri = keycloakProps.getUserEndpoint() + "/" + userId;
        try {
            ResponseEntity<Void> response = webClient.delete()
                    .uri(deleteUri)
                    .header("Authorization", "Bearer " + adminToken)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            if (response == null) {
                log.warn("No response from Keycloak when deleting user with ID {}", userId);
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No response from Keycloak");
            }

            int status = response.getStatusCode().value();
            return switch (status) {
                case 204 -> {
                    log.info("User with ID {} has been successfully deleted from Keycloak", userId);
                    yield true;
                }
                case 404 -> {
                    log.info("User with ID {} not found in Keycloak", userId);
                    yield false;
                }
                default -> {
                    log.warn("Unexpected status {} from Keycloak while trying to delete user with ID {}", status, userId);
                    yield false;
                }
            };
        } catch (WebClientResponseException ex) {
            log.error("Keycloak responded with status {} and body: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                return false;
            }
            throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
        } catch (WebClientRequestException ex) {
            log.error("Could not reach Keycloak for deleting user {}: {}", userId, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Keycloak is unavailable", ex);
        }
    }

}