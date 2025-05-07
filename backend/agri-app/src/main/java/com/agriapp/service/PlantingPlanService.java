package com.agriapp.service;

import com.agriapp.model.PlantingPlan;
import java.util.List;
import java.util.Optional;

public interface PlantingPlanService {
    PlantingPlan createPlan(PlantingPlan plan);
    Optional<PlantingPlan> getPlanById(String id);
    List<PlantingPlan> getAllPlans();
    List<PlantingPlan> getPlansByUserId(String userId);
    List<PlantingPlan> getPublicPlans();
    List<PlantingPlan> searchPlansByTitle(String title);
    List<PlantingPlan> getPlansByTag(String tag);
    PlantingPlan updatePlan(PlantingPlan plan);
    void deletePlan(String id);
    void addMilestone(String planId, PlantingPlan.Milestone milestone);
    void updateMilestone(String planId, PlantingPlan.Milestone milestone);
    void removeMilestone(String planId, String milestoneId);
    void likePlan(String planId);
}