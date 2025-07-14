package backend.model;

import backend.model.enums.ConnectionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "user_challenge_connection")
@IdClass(UserChallengeConnectionEntity.Pk.class)
public class UserChallengeConnectionEntity {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "challenge_id")
    private UUID challengeId;

    @Id
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    @Column(name = "\"type\"", columnDefinition = "connection_type")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ConnectionType connectionType;

    @Column(name = "ts", nullable = false, updatable = false)
    private OffsetDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", insertable = false, updatable = false)
    private ChallengeEntity challenge;

    // Composite primary-key representation required by JPA when you tag several columns with @Id
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pk implements Serializable {
        private UUID userId;
        private UUID challengeId;

        private ConnectionType connectionType;
    }

    @PrePersist private void prePersist() {
        if (timestamp == null) timestamp = OffsetDateTime.now();
    }
}

