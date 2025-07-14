package backend.service;

import backend.dto.ChallengeQueryDTO;
import backend.dto.request.CreateChallengeRequestDTO;
import backend.dto.response.ChallengeDetailsDTO;
import backend.dto.response.ChallengeSummaryDTO;
import backend.mapper.ChallengeMapper;
import backend.model.ChallengeEntity;
import backend.model.UserEntity;
import backend.model.enums.ConnectionType;
import backend.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChallengeServiceImpl implements ChallengeService{
    private final ChallengeRepository challengeRepo;
    private final ChallengeMapper challengeMapper;
    private final UserChallengeConnectionServiceImpl connService;
    private final UserService userService;
    private final UserStatsService statsService;

    @Override
    public ChallengeEntity getChallengeById(UUID challengeId) {
        return challengeRepo.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found " + challengeId));
    }

    @Override
    public List<ChallengeSummaryDTO> listChallenges(ChallengeQueryDTO query) {
        return List.of();
    }

    @Override
    public ChallengeDetailsDTO createChallenge(CreateChallengeRequestDTO req, UUID authorId) {
        ChallengeEntity entity = challengeMapper.toEntity(req);
        ChallengeEntity saved = challengeRepo.save(entity);
        log.info("Challenge created");

        connService.createUserChallengeConnection(authorId, saved.getId(), ConnectionType.author);

        UserEntity user = userService.findById(authorId);
        String authorUsername = user.getUsername();
        String authorAvatarUrl = user.getAvatarUrl();

        statsService.incrementCreatedChallengesCount(authorId);

        return challengeMapper.toDetailsDTO(saved, authorId, authorUsername, authorAvatarUrl);
    }

    @Override
    public void likeChallenge(UUID challengeId) {

    }

    @Override
    public void saveChallenge(UUID challengeId, UUID userId) {

    }

    @Override
    public void acceptChallenge(UUID challengeId, UUID userId) {

    }

    @Override
    public void submitCompletion(UUID userId, UUID challengeId) {

    }

    @Override
    public void completeChallenge(UUID challengeId, UUID userId) {

    }

    @Override
    public void challengeUser(UUID challengeId, UUID userId) {

    }
}
