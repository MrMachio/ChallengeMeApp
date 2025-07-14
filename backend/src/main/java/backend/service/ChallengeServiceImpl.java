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
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    public ChallengeSummaryDTO toChallengeSummaryDTO(ChallengeEntity entity) {
        UserEntity author = connService.getAuthorForChallenge(entity.getId());
        String authorUsername = author.getUsername();
        String authorAvatarUrl = author.getAvatarUrl();

        return challengeMapper.toSummaryDTO(entity, authorUsername, authorAvatarUrl);
    }

    @Override
    public List<ChallengeSummaryDTO> listChallenges(ChallengeQueryDTO query, UUID userId) {
        Specification<ChallengeEntity> spec = (root, q, cb) -> cb.conjunction();

        if (query.category() != null) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("category"), query.category()));
        }
        if (query.difficulty() != null) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("difficulty"), query.difficulty()));
        }

        Sort sort = Sort.unsorted();
        if (query.sortType() != null) {
            switch (query.sortType()) {
                case likes -> sort = Sort.by(Sort.Direction.DESC, "likes");
                case submissions -> sort = Sort.by(Sort.Direction.DESC, "submissions");
                case points -> sort = Sort.by(Sort.Direction.DESC, "points");
            }
        }

        return challengeRepo.findAll(spec, sort)
                .stream()
                .map(this::toChallengeSummaryDTO)
                .toList();
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
    public ChallengeDetailsDTO viewChallenge(UUID challengeId) {
        ChallengeEntity challenge = getChallengeById(challengeId);
        UserEntity author = connService.getAuthorForChallenge(challengeId);

        return challengeMapper.toDetailsDTO(challenge, author.getId(), author.getUsername(), author.getAvatarUrl());
    }

    @Override
    public void likeChallenge(UUID challengeId) {

    }

    @Override
    public void saveChallenge(UUID challengeId, UUID userId) {
        connService.createUserChallengeConnection(userId, challengeId, ConnectionType.saved);
    }

    @Override
    public void unsaveChallenge(UUID challengeId, UUID userId) {
        connService.deleteUserChallengeConnection(userId, challengeId, ConnectionType.saved);
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
