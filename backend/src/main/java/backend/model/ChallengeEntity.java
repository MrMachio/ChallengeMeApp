package backend.model;

import backend.model.enums.ChallengeCategory;
import backend.model.enums.ChallengeDifficulty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "challenges")
public class ChallengeEntity {

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "image")
    private String coverImageUrl;
    private int points;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "challenge_category")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ChallengeCategory category;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "challenge_difficulty")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ChallengeDifficulty difficulty;

    private int likesCount;
    private int submissionsCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "challenge", fetch = FetchType.LAZY)
    private List<SubmissionEntity> submissions = new ArrayList<>();

    @OneToMany(mappedBy = "challenge", fetch = FetchType.LAZY)
    private List<CommentEntity> comments = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
