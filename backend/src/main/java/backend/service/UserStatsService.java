package backend.service;

import backend.model.UserStatsEntity;
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

    public void incrementCreatedChallengesCount(UUID userId) {
        UserStatsEntity stats = getStatsByUserId(userId);
        stats.setCreatedChallengesCount(stats.getCompleteChallengesCount() + 1);
        statsRepo.save(stats);
        log.info("Incremented createdChallengesCount");
    }

    // TODO increment saved chalenges
}
