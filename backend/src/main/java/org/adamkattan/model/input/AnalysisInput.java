package org.adamkattan.model.input;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.adamkattan.model.entities.Entities;
import org.adamkattan.model.graph.Graph;
import org.adamkattan.model.methods.MicroserviceNode;
import org.adamkattan.model.project.Project;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "analysis_input")
public class AnalysisInput extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "project_id")
    public Project project;

    @NotBlank(message = "version is required")
    @Column(nullable = false)
    public String version;

    @NotBlank(message = "commitHash is required")
    @Column(nullable = false, name = "commit_hash")
    public String commitHash;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb", name = "entities")
    public Entities entities;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb", name = "graph")
    public Graph graph;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb", name = "methods")
    public List<MicroserviceNode> methods;

    @Column(nullable = false, name = "created_at")
    public LocalDateTime createdAt;

    public static AnalysisInputFullDto toFullDto(AnalysisInput input) {
        return new AnalysisInputFullDto(
                input.project.id,
                input.version,
                input.commitHash,
                input.entities,
                input.graph,
                input.methods,
                input.createdAt
        );
    }

    public static AnalysisInputDto toDto(AnalysisInput input) {
        return new AnalysisInputDto(
                input.project.id,
                input.version,
                input.commitHash,
                input.createdAt
        );
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}