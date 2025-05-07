package com.agriapp.service;

import com.agriapp.model.LearningProgress;
import java.util.List;
import java.util.Optional;

public interface LearningProgressService {
    LearningProgress createProgress(LearningProgress progress);
    Optional<LearningProgress> getProgressById(String id);
    List<LearningProgress> getAllProgress();
    List<LearningProgress> getProgressByUserId(String userId);
    List<LearningProgress> getProgressByLearningPathId(String learningPathId);
    Optional<LearningProgress> getProgressByUserAndPath(String userId, String learningPathId);
    LearningProgress updateProgress(LearningProgress progress);
    void deleteProgress(String id);
    void completeMilestone(String progressId, LearningProgress.CompletedMilestone completedMilestone);
    void updateProgressPercentage(String progressId);
    void awardBadge(String progressId, String badge);
    void likeProgress(String progressId);
    List<LearningProgress> getRecentProgressByUser(String userId);
}