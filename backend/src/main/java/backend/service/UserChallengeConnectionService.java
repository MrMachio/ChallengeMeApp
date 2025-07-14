package backend.service;

import backend.dto.response.ChallengeSummaryDTO;
import backend.model.UserChallengeConnectionEntity;
import backend.model.enums.ConnectionType;

import java.util.List;
import java.util.UUID;

public interface UserChallengeConnectionService {
    List<ChallengeSummaryDTO> getChallengesForUserByConnectionType(UUID userId, ConnectionType connType);

    UserChallengeConnectionEntity createUserChallengeConnection(UUID userId, UUID challengeId, ConnectionType connType);

    void deleteUserChallengeConnection(UUID userId, UUID challengeId, ConnectionType connType);





}
