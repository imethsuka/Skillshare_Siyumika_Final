package com.agriapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "learning_paths")
public class LearningPath {
    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Milestone> milestones = new ArrayList<>();
    private boolean isPublic = true;
    private List<String> tags = new ArrayList<>();
    private int likes = 0;
    
    // Nested Milestone class
    public static class Milestone {
        private String id;
        private String title;
        private String description;
        private int orderIndex;
        private List<String> resources = new ArrayList<>();
        
        // Constructors, getters and setters
        public Milestone() {}
        
        public Milestone(String title, String description, int orderIndex) {
            this.title = title;
            this.description = description;
            this.orderIndex = orderIndex;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public int getOrderIndex() {
            return orderIndex;
        }
        
        public void setOrderIndex(int orderIndex) {
            this.orderIndex = orderIndex;
        }
        
        public List<String> getResources() {
            return resources;
        }
        
        public void setResources(List<String> resources) {
            this.resources = resources;
        }
    }
    
    // Constructors
    public LearningPath() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<Milestone> getMilestones() {
        return milestones;
    }
    
    public void setMilestones(List<Milestone> milestones) {
        this.milestones = milestones;
    }
    
    public boolean isPublic() {
        return isPublic;
    }
    
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public int getLikes() {
        return likes;
    }
    
    public void setLikes(int likes) {
        this.likes = likes;
    }
}