package backend.dto;

import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import backend.model.enums.ConnectionType;

public record ChallengeQueryDTO(
   ConnectionType connectionType,
   ChallengeDifficulty difficulty,
   ChallengeCategory category,
   SortType sortType

) {}

