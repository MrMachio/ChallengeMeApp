package backend.dto;

public record UserStatsDTO (
        int points,
        int createdChallengesCount,
        int completeChallengesCount,
        int activeChallengesCount,
        int savedChallengesCount,
        int submissionsCount
) {
}
