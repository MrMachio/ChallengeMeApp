package backend.dto;

import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import backend.model.enums.ConnectionType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public record ChallengeQueryDTO(
   ConnectionType connectionType,
   ChallengeDifficulty difficulty,
   ChallengeCategory category,
   SortType sortType
) {
    public static ChallengeQueryDTO fromStrings(
            String connectionType,
            String difficulty,
            String category,
            String sortType
    ) {
        return new ChallengeQueryDTO(
                parseEnum(ConnectionType.class, connectionType),
                parseEnum(ChallengeDifficulty.class, difficulty),
                parseEnum(ChallengeCategory.class, category),
                parseEnum(SortType.class, sortType)
        );
    }

    private static <T extends Enum<T>> T parseEnum(Class<T> enumClass, String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Enum.valueOf(enumClass, value.toLowerCase());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid value for " + enumClass.getSimpleName() + ": " + value
            );
        }
    }
}

