package com.agriapp.service;

import com.agriapp.model.PlantProgress;
import java.util.List;
import java.util.Optional;

public interface PlantProgressService {
    PlantProgress createProgress(PlantProgress progress);
    Optional<PlantProgress> getProgressById(String id);
    List<PlantProgress> getAllProgress();
    List<PlantProgress> getProgressByUserId(String userId);
    List<PlantProgress> getProgressByPlantingPlanId(String plantingPlanId);
    Optional<PlantProgress> getProgressByUserAndPlan(String userId, String plantingPlanId);
    PlantProgress updateProgress(PlantProgress progress);
    void deleteProgress(String id);
    void completeMilestone(String progressId, PlantProgress.CompletedMilestone completedMilestone);
    void updateProgressPercentage(String progressId);
    void awardBadge(String progressId, String badge);
    void likeProgress(String progressId);
    List<PlantProgress> getRecentProgressByUser(String userId);
}