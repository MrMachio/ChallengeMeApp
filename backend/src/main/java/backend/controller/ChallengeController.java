package backend.controller;

import backend.dto.ChallengeQueryDTO;
import backend.dto.request.CreateChallengeRequestDTO;
import backend.dto.response.ChallengeDetailsDTO;
import backend.dto.response.ChallengeSummaryDTO;
import backend.mapper.ChallengeMapper;
import backend.model.ChallengeEntity;
import backend.service.ChallengeServiceImpl;
import backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeServiceImpl challengeService;

    @PostMapping
    public ChallengeDetailsDTO createChallenge(@RequestBody @Valid CreateChallengeRequestDTO req,
                                               @AuthenticationPrincipal Jwt jwt) {
        UUID authorId = UUID.fromString(jwt.getSubject());
        return challengeService.createChallenge(req, authorId);
    }

    @GetMapping("/{challengeId}")
    public ChallengeDetailsDTO viewChallenge(@PathVariable UUID challengeId) {
        return challengeService.viewChallenge(challengeId);
    }

    @GetMapping
    public List<ChallengeSummaryDTO> listChallenges(
            @RequestParam(required = false) String userConnectionType,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortType,
            @AuthenticationPrincipal Jwt jwt) {

        ChallengeQueryDTO queryDTO = ChallengeQueryDTO.fromStrings(userConnectionType, difficulty, category, sortType);
        UUID userId = UUID.fromString(jwt.getSubject());
        return challengeService.listChallenges(queryDTO, userId);
    }

    @PatchMapping("/{challengeId}/save")
    public void saveChallenge(@PathVariable UUID challengeId, @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        challengeService.saveChallenge(challengeId, userId);
    }

    @PatchMapping("/{challengeId}/unsave")
    public void unsaveChallenge(@PathVariable UUID challengeId, @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        challengeService.unsaveChallenge(challengeId, userId);
    }

    @PatchMapping("/{challengeId}/accept")
    public void acceptChallenge(@PathVariable UUID challengeId, @AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        challengeService.acceptChallenge(challengeId, userId);
    }

    @PatchMapping("/{challengeId}/invite/{userId}")
    public void challengeUser(@PathVariable UUID challengeId, @PathVariable UUID userId) {

        challengeService.challengeUser(challengeId, userId);
    }


    @PatchMapping("/{challengeId}/accept/{userId}")
    public void acceptUserCompletion(@PathVariable UUID challengeId, @PathVariable UUID userId, @AuthenticationPrincipal Jwt jwt) {
        UUID authorId = UUID.fromString(jwt.getSubject());
        challengeService.completeChallenge(challengeId, userId, authorId);
    }
}
