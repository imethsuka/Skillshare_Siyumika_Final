package com.agriapp.service.impl;

import com.agriapp.model.LearningProgress;
import com.agriapp.model.LearningPath;
import com.agriapp.repository.LearningProgressRepository;
import com.agriapp.repository.LearningPathRepository;
import com.agriapp.service.LearningProgressService;
import com.agriapp.service.UserService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressServiceImpl implements LearningProgressService {

    private final LearningProgressRepository learningProgressRepository;
    private final LearningPathRepository learningPathRepository;
    private final UserService userService;

    public LearningProgressServiceImpl(
            LearningProgressRepository learningProgressRepository,
            LearningPathRepository learningPathRepository,
            UserService userService) {
        this.learningProgressRepository = learningProgressRepository;
        this.learningPathRepository = learningPathRepository;
        this.userService = userService;
    }

    @Override
    public LearningProgress createProgress(LearningProgress progress) {
        // Check if the learning path exists
        Optional<LearningPath> learningPathOpt = learningPathRepository.findById(progress.getLearningPathId());
        if (!learningPathOpt.isPresent()) {
            throw new RuntimeException("Learning path not found with ID: " + progress.getLearningPathId());
        }
        
        // Initialize start time if not already set
        if (progress.getStartedAt() == null) {
            progress.setStartedAt(LocalDateTime.now());
        }
        
        progress.setLastUpdatedAt(LocalDateTime.now());
        
        // Calculate initial progress percentage based on completed milestones
        updateProgressPercentageInternal(progress, learningPathOpt.get());
        
        return learningProgressRepository.save(progress);
    }

    @Override
    public Optional<LearningProgress> getProgressById(String id) {
        return learningProgressRepository.findById(id);
    }

    @Override
    public List<LearningProgress> getAllProgress() {
        return learningProgressRepository.findAll();
    }

    @Override
    public List<LearningProgress> getProgressByUserId(String userId) {
        return learningProgressRepository.findByUserId(userId);
    }

    @Override
    public List<LearningProgress> getProgressByLearningPathId(String learningPathId) {
        return learningProgressRepository.findByLearningPathId(learningPathId);
    }

    @Override
    public Optional<LearningProgress> getProgressByUserAndPath(String userId, String learningPathId) {
        return learningProgressRepository.findByUserIdAndLearningPathId(userId, learningPathId);
    }
    
    @Override
    public LearningProgress updateProgress(LearningProgress progress) {
        if (!learningProgressRepository.existsById(progress.getId())) {
            throw new RuntimeException("Learning progress not found with ID: " + progress.getId());
        }
        
        progress.setLastUpdatedAt(LocalDateTime.now());
        
        // Recalculate progress percentage
        Optional<LearningPath> learningPathOpt = learningPathRepository.findById(progress.getLearningPathId());
        if (learningPathOpt.isPresent()) {
            updateProgressPercentageInternal(progress, learningPathOpt.get());
        }
        
        return learningProgressRepository.save(progress);
    }

    @Override
    public void deleteProgress(String id) {
        learningProgressRepository.deleteById(id);
    }

    @Override
    public void completeMilestone(String progressId, LearningProgress.CompletedMilestone completedMilestone) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            
            // Set completion time if not provided
            if (completedMilestone.getCompletedAt() == null) {
                completedMilestone.setCompletedAt(LocalDateTime.now());
            }
            
            // Check if milestone has already been completed
            boolean alreadyCompleted = progress.getCompletedMilestones().stream()
                    .anyMatch(cm -> cm.getMilestoneId().equals(completedMilestone.getMilestoneId()));
            
            if (!alreadyCompleted) {
                progress.getCompletedMilestones().add(completedMilestone);
                progress.setLastUpdatedAt(LocalDateTime.now());
                
                // Recalculate progress percentage
                Optional<LearningPath> learningPathOpt = learningPathRepository.findById(progress.getLearningPathId());
                if (learningPathOpt.isPresent()) {
                    LearningPath learningPath = learningPathOpt.get();
                    
                    updateProgressPercentageInternal(progress, learningPath);
                    
                    // Check for completion and award badges if needed
                    checkAndAwardBadges(progress, learningPath);
                }
                
                learningProgressRepository.save(progress);
            }
        } else {
            throw new RuntimeException("Learning progress not found with ID: " + progressId);
        }
    }

    @Override
    public void updateProgressPercentage(String progressId) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            
            Optional<LearningPath> learningPathOpt = learningPathRepository.findById(progress.getLearningPathId());
            if (learningPathOpt.isPresent()) {
                LearningPath learningPath = learningPathOpt.get();
                
                updateProgressPercentageInternal(progress, learningPath);
                
                // Check for completion and award badges if needed
                checkAndAwardBadges(progress, learningPath);
                
                progress.setLastUpdatedAt(LocalDateTime.now());
                learningProgressRepository.save(progress);
            } else {
                throw new RuntimeException("Learning path not found with ID: " + progress.getLearningPathId());
            }
        } else {
            throw new RuntimeException("Learning progress not found with ID: " + progressId);
        }
    }

    @Override
    public void awardBadge(String progressId, String badge) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            
            if (!progress.getAwardedBadges().contains(badge)) {
                progress.getAwardedBadges().add(badge);
                progress.setLastUpdatedAt(LocalDateTime.now());
                learningProgressRepository.save(progress);
            }
        } else {
            throw new RuntimeException("Learning progress not found with ID: " + progressId);
        }
    }
    
    @Override
    public void likeProgress(String progressId) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            progress.setLikes(progress.getLikes() + 1);
            progress.setLastUpdatedAt(LocalDateTime.now());
            learningProgressRepository.save(progress);
        } else {
            throw new RuntimeException("Learning progress not found with ID: " + progressId);
        }
    }
    
    @Override
    public List<LearningProgress> getRecentProgressByUser(String userId) {
        return learningProgressRepository.findByUserIdOrderByLastUpdatedAtDesc(userId);
    }
    
    // Helper method to calculate progress percentage
    private void updateProgressPercentageInternal(LearningProgress progress, LearningPath learningPath) {
        if (learningPath.getMilestones() == null || learningPath.getMilestones().isEmpty()) {
            progress.setProgressPercentage(0);
            return;
        }
        
        int totalMilestones = learningPath.getMilestones().size();
        int completedMilestones = progress.getCompletedMilestones().size();
        
        double percentage = ((double) completedMilestones / totalMilestones) * 100;
        progress.setProgressPercentage(percentage);
    }
    
    // Helper method to check completion and award badges
    private void checkAndAwardBadges(LearningProgress progress, LearningPath learningPath) {
        // Award badge for 100% completion
        if (progress.getProgressPercentage() >= 100 && 
                !progress.getAwardedBadges().contains("COMPLETION_MASTER")) {
            awardBadge(progress.getId(), "COMPLETION_MASTER");
        }
        
        // Award badge for 50% completion
        if (progress.getProgressPercentage() >= 50 && 
                !progress.getAwardedBadges().contains("HALFWAY_HERO")) {
            awardBadge(progress.getId(), "HALFWAY_HERO");
        }
        
        // If the course was about programming, award a programming specific badge on completion
        if (progress.getProgressPercentage() >= 100 && 
                learningPath.getTags().contains("programming") && 
                !progress.getAwardedBadges().contains("CODING_EXPERT")) {
            awardBadge(progress.getId(), "CODING_EXPERT");
        }
    }
}