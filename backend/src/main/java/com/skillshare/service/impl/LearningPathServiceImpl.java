package com.skillshare.service.impl;

import com.skillshare.model.LearningPath;
import com.skillshare.repository.LearningPathRepository;
import com.skillshare.service.LearningPathService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LearningPathServiceImpl implements LearningPathService {

    private final LearningPathRepository learningPathRepository;

    public LearningPathServiceImpl(LearningPathRepository learningPathRepository) {
        this.learningPathRepository = learningPathRepository;
    }

    @Override
    public LearningPath createPath(LearningPath path) {
        path.setCreatedAt(LocalDateTime.now());
        path.setUpdatedAt(LocalDateTime.now());
        
        // Generate IDs for milestones if they don't have one
        if (path.getMilestones() != null) {
            for (LearningPath.Milestone milestone : path.getMilestones()) {
                if (milestone.getId() == null || milestone.getId().isEmpty()) {
                    milestone.setId(UUID.randomUUID().toString());
                }
            }
        }
        
        return learningPathRepository.save(path);
    }

    @Override
    public Optional<LearningPath> getPathById(String id) {
        return learningPathRepository.findById(id);
    }

    @Override
    public List<LearningPath> getAllPaths() {
        return learningPathRepository.findAll();
    }

    @Override
    public List<LearningPath> getPathsByUserId(String userId) {
        return learningPathRepository.findByUserId(userId);
    }

    @Override
    public List<LearningPath> getPublicPaths() {
        return learningPathRepository.findByIsPublic(true);
    }

    @Override
    public List<LearningPath> searchPathsByTitle(String title) {
        return learningPathRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<LearningPath> getPathsByTag(String tag) {
        return learningPathRepository.findByTagsContaining(tag);
    }

    @Override
    public LearningPath updatePath(LearningPath path) {
        if (!learningPathRepository.existsById(path.getId())) {
            throw new RuntimeException("Learning path not found with ID: " + path.getId());
        }
        
        path.setUpdatedAt(LocalDateTime.now());
        
        // Ensure all milestones have IDs
        if (path.getMilestones() != null) {
            for (LearningPath.Milestone milestone : path.getMilestones()) {
                if (milestone.getId() == null || milestone.getId().isEmpty()) {
                    milestone.setId(UUID.randomUUID().toString());
                }
            }
        }
        
        return learningPathRepository.save(path);
    }

    @Override
    public void deletePath(String id) {
        learningPathRepository.deleteById(id);
    }

    @Override
    public void addMilestone(String pathId, LearningPath.Milestone milestone) {
        Optional<LearningPath> pathOpt = learningPathRepository.findById(pathId);
        if (pathOpt.isPresent()) {
            LearningPath path = pathOpt.get();
            
            // Generate ID for the milestone
            if (milestone.getId() == null || milestone.getId().isEmpty()) {
                milestone.setId(UUID.randomUUID().toString());
            }
            
            path.getMilestones().add(milestone);
            path.setUpdatedAt(LocalDateTime.now());
            
            learningPathRepository.save(path);
        } else {
            throw new RuntimeException("Learning path not found with ID: " + pathId);
        }
    }

    @Override
    public void updateMilestone(String pathId, LearningPath.Milestone milestone) {
        Optional<LearningPath> pathOpt = learningPathRepository.findById(pathId);
        if (pathOpt.isPresent()) {
            LearningPath path = pathOpt.get();
            
            boolean found = false;
            for (int i = 0; i < path.getMilestones().size(); i++) {
                if (path.getMilestones().get(i).getId().equals(milestone.getId())) {
                    path.getMilestones().set(i, milestone);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                throw new RuntimeException("Milestone not found with ID: " + milestone.getId());
            }
            
            path.setUpdatedAt(LocalDateTime.now());
            learningPathRepository.save(path);
        } else {
            throw new RuntimeException("Learning path not found with ID: " + pathId);
        }
    }

    @Override
    public void removeMilestone(String pathId, String milestoneId) {
        Optional<LearningPath> pathOpt = learningPathRepository.findById(pathId);
        if (pathOpt.isPresent()) {
            LearningPath path = pathOpt.get();
            
            boolean removed = path.getMilestones().removeIf(m -> m.getId().equals(milestoneId));
            
            if (!removed) {
                throw new RuntimeException("Milestone not found with ID: " + milestoneId);
            }
            
            path.setUpdatedAt(LocalDateTime.now());
            learningPathRepository.save(path);
        } else {
            throw new RuntimeException("Learning path not found with ID: " + pathId);
        }
    }

    @Override
    public void likePath(String pathId) {
        Optional<LearningPath> pathOpt = learningPathRepository.findById(pathId);
        if (pathOpt.isPresent()) {
            LearningPath path = pathOpt.get();
            path.setLikes(path.getLikes() + 1);
            learningPathRepository.save(path);
        } else {
            throw new RuntimeException("Learning path not found with ID: " + pathId);
        }
    }
}