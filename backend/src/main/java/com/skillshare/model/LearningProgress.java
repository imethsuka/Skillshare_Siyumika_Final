package com.skillshare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "learning_progress")
public class LearningProgress {
    @Id
    private String id;
    private String userId;
    private String learningPathId;
    private double progressPercentage;
    private LocalDateTime startedAt;
    private LocalDateTime lastUpdatedAt;
    private List<CompletedMilestone> completedMilestones = new ArrayList<>();
    private List<String> awardedBadges = new ArrayList<>();
    private int likes = 0;
    
    // Nested class for completed milestones
    public static class CompletedMilestone {
        private String milestoneId;
        private LocalDateTime completedAt;
        private String notes;
        private List<String> mediaUrls = new ArrayList<>();
        
        // Constructors
        public CompletedMilestone() {}
        
        public CompletedMilestone(String milestoneId, LocalDateTime completedAt) {
            this.milestoneId = milestoneId;
            this.completedAt = completedAt;
        }
        
        // Getters and Setters
        public String getMilestoneId() {
            return milestoneId;
        }
        
        public void setMilestoneId(String milestoneId) {
            this.milestoneId = milestoneId;
        }
        
        public LocalDateTime getCompletedAt() {
            return completedAt;
        }
        
        public void setCompletedAt(LocalDateTime completedAt) {
            this.completedAt = completedAt;
        }
        
        public String getNotes() {
            return notes;
        }
        
        public void setNotes(String notes) {
            this.notes = notes;
        }
        
        public List<String> getMediaUrls() {
            return mediaUrls;
        }
        
        public void setMediaUrls(List<String> mediaUrls) {
            this.mediaUrls = mediaUrls;
        }
    }
    
    // Constructors
    public LearningProgress() {
        this.startedAt = LocalDateTime.now();
        this.lastUpdatedAt = LocalDateTime.now();
        this.progressPercentage = 0;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getLearningPathId() {
        return learningPathId;
    }
    
    public void setLearningPathId(String learningPathId) {
        this.learningPathId = learningPathId;
    }
    
    public double getProgressPercentage() {
        return progressPercentage;
    }
    
    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
    
    public LocalDateTime getStartedAt() {
        return startedAt;
    }
    
    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }
    
    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }
    
    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }
    
    public List<CompletedMilestone> getCompletedMilestones() {
        return completedMilestones;
    }
    
    public void setCompletedMilestones(List<CompletedMilestone> completedMilestones) {
        this.completedMilestones = completedMilestones;
    }
    
    public List<String> getAwardedBadges() {
        return awardedBadges;
    }
    
    public void setAwardedBadges(List<String> awardedBadges) {
        this.awardedBadges = awardedBadges;
    }
    
    public int getLikes() {
        return likes;
    }
    
    public void setLikes(int likes) {
        this.likes = likes;
    }
}