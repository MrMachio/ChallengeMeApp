package backend.service;

import backend.dto.ChallengeQueryDTO;
import backend.dto.request.CreateChallengeRequestDTO;
import backend.dto.response.ChallengeDetailsDTO;
import backend.dto.response.ChallengeSummaryDTO;
import backend.model.ChallengeEntity;

import java.util.List;
import java.util.UUID;

public interface ChallengeService {
    ChallengeEntity getChallengeById(UUID challengeId);

    List<ChallengeSummaryDTO> listChallenges(ChallengeQueryDTO query, UUID userId);

    ChallengeDetailsDTO createChallenge(CreateChallengeRequestDTO req, UUID userId);

    ChallengeDetailsDTO viewChallenge(UUID challengeId);

    void likeChallenge(UUID challengeId);
    void saveChallenge(UUID challengeId, UUID userId);
    void acceptChallenge(UUID challengeId, UUID userId);

    // Called by submissionService on pending submission
    void submitCompletion(UUID userId, UUID challengeId);
    // Called by submissionService on accepted submission
    void completeChallenge(UUID challengeId, UUID userId);

    void challengeUser(UUID challengeId, UUID userId);
}
