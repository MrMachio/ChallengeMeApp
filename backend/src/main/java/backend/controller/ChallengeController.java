package backend.controller;

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


}
