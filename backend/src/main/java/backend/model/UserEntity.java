package backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
import java.time.OffsetDateTime;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 255, unique = true)
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    @Column(columnDefinition = "TEXT")
    private String bio;
    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;
    private OffsetDateTime createdAt;

    @OneToOne(mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true,
            optional = false)
    private UserStatsEntity stats;

    public void setStats(UserStatsEntity stats) {
        this.stats = stats;
        if (stats != null) {
            stats.setUser(this);
        }
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }
}