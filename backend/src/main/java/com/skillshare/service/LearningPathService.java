package com.skillshare.service;

import com.skillshare.model.LearningPath;
import java.util.List;
import java.util.Optional;

public interface LearningPathService {
    LearningPath createPath(LearningPath path);
    Optional<LearningPath> getPathById(String id);
    List<LearningPath> getAllPaths();
    List<LearningPath> getPathsByUserId(String userId);
    List<LearningPath> getPublicPaths();
    List<LearningPath> searchPathsByTitle(String title);
    List<LearningPath> getPathsByTag(String tag);
    LearningPath updatePath(LearningPath path);
    void deletePath(String id);
    void addMilestone(String pathId, LearningPath.Milestone milestone);
    void updateMilestone(String pathId, LearningPath.Milestone milestone);
    void removeMilestone(String pathId, String milestoneId);
    void likePath(String pathId);
}