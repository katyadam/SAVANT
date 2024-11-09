package org.adamkattan.model.project;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.adamkattan.model.input.AnalysisInput;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "project")
public class Project extends PanacheEntity {

    @NotBlank(message = "projectName is required")
    @Column(nullable = false, name = "project_name")
    public String projectName;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Column(nullable = false, name = "inputs")
    public List<AnalysisInput> inputs;

    @Column(nullable = false, name = "created_at")
    public LocalDateTime createdAt;

    public static ProjectDto toDto(Project project) {
        return new ProjectDto(
                project.id,
                project.projectName
        );
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
