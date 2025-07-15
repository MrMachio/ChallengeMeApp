package backend.service;

import backend.model.UserStatsEntity;
import backend.model.enums.ConnectionType;
import backend.repository.UserStatsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatsService {
    private final UserStatsRepository statsRepo;

    public UserStatsEntity getStatsByUserId(UUID userId) {
        return statsRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User stats not found"));
    }

//    public void incrementCreatedChallengesCount(UUID userId) {
//        UserStatsEntity stats = getStatsByUserId(userId);
//        stats.setCreatedChallengesCount(stats.getCompleteChallengesCount() + 1);
//        statsRepo.save(stats);
//        log.info("Incremented createdChallengesCount");
//    }

    public void addPoints(UUID userId, int points) {
        UserStatsEntity stats = getStatsByUserId(userId);
        stats.setPoints(stats.getPoints() + points);
        statsRepo.save(stats);
        log.info("Added {} points", points);
    }

    public void incrementCounter(UUID userId, ConnectionType connType) {
        UserStatsEntity stats = getStatsByUserId(userId);
        switch (connType) {
            case author -> stats.setCreatedChallengesCount(stats.getCompleteChallengesCount() + 1);
            case active -> stats.setActiveChallengesCount(stats.getActiveChallengesCount() + 1);
            case complete -> stats.setCompleteChallengesCount(stats.getCompleteChallengesCount() + 1);
            case saved -> stats.setSavedChallengesCount(stats.getSavedChallengesCount() + 1);
            case pending_verification -> stats.setSubmissionsCount(stats.getSubmissionsCount() + 1);
            case awaiting_response -> log.info("User has been challenged by another user");
            default -> throw new IllegalArgumentException("Unknown connection type: " + connType);
        }
        statsRepo.save(stats);
        log.info("Incremented {} counter for user {}", connType, userId);
    }

    public void decrementCounter(UUID userId, ConnectionType connType) {
        UserStatsEntity stats = getStatsByUserId(userId);
        switch (connType) {
            case author -> stats.setCreatedChallengesCount(stats.getCompleteChallengesCount() - 1);
            case active -> stats.setActiveChallengesCount(stats.getActiveChallengesCount() - 1);
            case complete -> stats.setCompleteChallengesCount(stats.getCompleteChallengesCount() - 1);
            case saved -> stats.setSavedChallengesCount(stats.getSavedChallengesCount() - 1);
            case pending_verification -> stats.setSubmissionsCount(stats.getSubmissionsCount() - 1);
            case awaiting_response -> log.info("User has accepted or rejected a challenge request");
            default -> throw new IllegalArgumentException("Unknown connection type: " + connType);
        }
        statsRepo.save(stats);
        log.info("Decremented {} counter for user {}", connType, userId);
    }

}
