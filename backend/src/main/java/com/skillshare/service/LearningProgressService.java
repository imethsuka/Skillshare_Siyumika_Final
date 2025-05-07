package com.skillshare.service;

import com.skillshare.model.LearningProgress;
import java.util.List;
import java.util.Optional;

public interface LearningProgressService {
    LearningProgress createProgress(LearningProgress progress);
    Optional<LearningProgress> getProgressById(String id);
    List<LearningProgress> getAllProgress();
    List<LearningProgress> getProgressByUserId(String userId);
    List<LearningProgress> getProgressByLearningPathId(String pathId);
    Optional<LearningProgress> getProgressByUserAndPath(String userId, String pathId);
    LearningProgress updateProgress(LearningProgress progress);
    void deleteProgress(String id);
    void completeMilestone(String progressId, LearningProgress.CompletedMilestone milestone);
    void updateProgressPercentage(String progressId);
    void awardBadge(String progressId, String badge);
    void likeProgress(String progressId);
    List<LearningProgress> getRecentProgressByUser(String userId);
}