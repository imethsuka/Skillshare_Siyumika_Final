package com.agriapp.service.impl;

import com.agriapp.model.PlantingPlan;
import com.agriapp.repository.PlantingPlanRepository;
import com.agriapp.service.PlantingPlanService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlantingPlanServiceImpl implements PlantingPlanService {

    private final PlantingPlanRepository plantingPlanRepository;

    public PlantingPlanServiceImpl(PlantingPlanRepository plantingPlanRepository) {
        this.plantingPlanRepository = plantingPlanRepository;
    }

    @Override
    public PlantingPlan createPlan(PlantingPlan plan) {
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        
        // Generate IDs for milestones if they don't have one
        if (plan.getMilestones() != null) {
            for (PlantingPlan.Milestone milestone : plan.getMilestones()) {
                if (milestone.getId() == null || milestone.getId().isEmpty()) {
                    milestone.setId(UUID.randomUUID().toString());
                }
            }
        }
        
        return plantingPlanRepository.save(plan);
    }

    @Override
    public Optional<PlantingPlan> getPlanById(String id) {
        return plantingPlanRepository.findById(id);
    }

    @Override
    public List<PlantingPlan> getAllPlans() {
        return plantingPlanRepository.findAll();
    }

    @Override
    public List<PlantingPlan> getPlansByUserId(String userId) {
        return plantingPlanRepository.findByUserId(userId);
    }

    @Override
    public List<PlantingPlan> getPublicPlans() {
        return plantingPlanRepository.findByIsPublic(true);
    }

    @Override
    public List<PlantingPlan> searchPlansByTitle(String title) {
        return plantingPlanRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<PlantingPlan> getPlansByTag(String tag) {
        return plantingPlanRepository.findByTagsContaining(tag);
    }

    @Override
    public PlantingPlan updatePlan(PlantingPlan plan) {
        if (!plantingPlanRepository.existsById(plan.getId())) {
            throw new RuntimeException("Planting plan not found with ID: " + plan.getId());
        }
        
        plan.setUpdatedAt(LocalDateTime.now());
        
        // Ensure all milestones have IDs
        if (plan.getMilestones() != null) {
            for (PlantingPlan.Milestone milestone : plan.getMilestones()) {
                if (milestone.getId() == null || milestone.getId().isEmpty()) {
                    milestone.setId(UUID.randomUUID().toString());
                }
            }
        }
        
        return plantingPlanRepository.save(plan);
    }

    @Override
    public void deletePlan(String id) {
        plantingPlanRepository.deleteById(id);
    }

    @Override
    public void addMilestone(String planId, PlantingPlan.Milestone milestone) {
        Optional<PlantingPlan> planOpt = plantingPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            PlantingPlan plan = planOpt.get();
            
            // Generate ID for the milestone
            if (milestone.getId() == null || milestone.getId().isEmpty()) {
                milestone.setId(UUID.randomUUID().toString());
            }
            
            plan.getMilestones().add(milestone);
            plan.setUpdatedAt(LocalDateTime.now());
            
            plantingPlanRepository.save(plan);
        } else {
            throw new RuntimeException("Planting plan not found with ID: " + planId);
        }
    }

    @Override
    public void updateMilestone(String planId, PlantingPlan.Milestone milestone) {
        Optional<PlantingPlan> planOpt = plantingPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            PlantingPlan plan = planOpt.get();
            
            boolean found = false;
            for (int i = 0; i < plan.getMilestones().size(); i++) {
                if (plan.getMilestones().get(i).getId().equals(milestone.getId())) {
                    plan.getMilestones().set(i, milestone);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                throw new RuntimeException("Milestone not found with ID: " + milestone.getId());
            }
            
            plan.setUpdatedAt(LocalDateTime.now());
            plantingPlanRepository.save(plan);
        } else {
            throw new RuntimeException("Planting plan not found with ID: " + planId);
        }
    }

    @Override
    public void removeMilestone(String planId, String milestoneId) {
        Optional<PlantingPlan> planOpt = plantingPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            PlantingPlan plan = planOpt.get();
            
            boolean removed = plan.getMilestones().removeIf(m -> m.getId().equals(milestoneId));
            
            if (!removed) {
                throw new RuntimeException("Milestone not found with ID: " + milestoneId);
            }
            
            plan.setUpdatedAt(LocalDateTime.now());
            plantingPlanRepository.save(plan);
        } else {
            throw new RuntimeException("Planting plan not found with ID: " + planId);
        }
    }

    @Override
    public void likePlan(String planId) {
        Optional<PlantingPlan> planOpt = plantingPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            PlantingPlan plan = planOpt.get();
            plan.setLikes(plan.getLikes() + 1);
            plantingPlanRepository.save(plan);
        } else {
            throw new RuntimeException("Planting plan not found with ID: " + planId);
        }
    }
}