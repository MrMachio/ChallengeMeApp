package backend.service;

import backend.dto.response.ChallengeSummaryDTO;
import backend.model.UserChallengeConnectionEntity;
import backend.model.UserEntity;
import backend.model.enums.ConnectionType;
import backend.repository.UserChallengeConnectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserChallengeConnectionServiceImpl implements UserChallengeConnectionService{
    private final UserChallengeConnectionRepository connRepo;

    @Override
    public List<ChallengeSummaryDTO> getChallengesForUserByConnectionType(UUID userId, ConnectionType connType) {
        return List.of();
    }

    @Override
    public UserChallengeConnectionEntity createUserChallengeConnection(UUID userId, UUID challengeId, ConnectionType connType) {
        UserChallengeConnectionEntity entity = UserChallengeConnectionEntity.builder()
                .challengeId(challengeId)
                .userId(userId)
                .connectionType(connType)
                .timestamp(OffsetDateTime.now())
                .build();
        UserChallengeConnectionEntity saved = connRepo.save(entity);
        log.info("Successfully established connection of type [{}] between user and challenge at ts -> {}",
                connType.toString(), saved.getTimestamp().toString());
        return saved;
    }

    @Override
    public UserEntity getAuthorForChallenge(UUID challengeId) {
        List<UserChallengeConnectionEntity> connList = connRepo.findByChallengeIdAndConnectionType(challengeId, ConnectionType.author);
        UserChallengeConnectionEntity authorConn = connList.getFirst();
        return authorConn.getUser();
    }

    @Override
    public void deleteUserChallengeConnection(UUID userId, UUID challengeId, ConnectionType connType) {
        int deleted_rows = connRepo.deleteByUserIdAndChallengeIdAndConnectionType(userId, challengeId, connType);
        log.info("Deleted {} user-challenge connection(s) for userId={}, challengeId={}, connectionType={}",
                deleted_rows, userId, challengeId, connType);
    }
}
