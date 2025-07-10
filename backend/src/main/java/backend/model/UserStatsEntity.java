package backend.model;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "user_stats")
public class UserStatsEntity {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "user_id")
    private UUID userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private int points;
    private int createdChallengesCount;
    private int completeChallengesCount;
    private int activeChallengesCount;
    private int savedChallengesCount;
    private int submissionsCount;
}
