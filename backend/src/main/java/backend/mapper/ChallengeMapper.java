package backend.mapper;

import backend.dto.request.CreateChallengeRequestDTO;
import backend.dto.response.ChallengeDetailsDTO;
import backend.dto.response.ChallengeSummaryDTO;
import backend.model.ChallengeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ChallengeMapper {
    @Mapping(target = "likesCount",     constant = "0")
    @Mapping(target = "submissionsCount", constant = "0")
    @Mapping(target = "id",            ignore   = true)
    @Mapping(target = "createdAt",     ignore   = true)
    @Mapping(target = "submissions",   ignore   = true)
    @Mapping(target = "comments",      ignore   = true)
    ChallengeEntity toEntity(CreateChallengeRequestDTO request);

    ChallengeDetailsDTO toDetailsDTO(ChallengeEntity entity, UUID authorId, String authorUsername, String authorAvatarUrl);

    ChallengeSummaryDTO toSummaryDTO(ChallengeEntity entity, String authorUsername, String authorAvatarUrl);
}
