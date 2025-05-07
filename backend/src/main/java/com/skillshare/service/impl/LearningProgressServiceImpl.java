package com.skillshare.service.impl;

import com.skillshare.model.LearningProgress;
import com.skillshare.service.LearningProgressService;
import com.skillshare.repository.LearningProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressServiceImpl implements LearningProgressService {

    private final LearningProgressRepository learningProgressRepository;

    @Autowired
    public LearningProgressServiceImpl(LearningProgressRepository learningProgressRepository) {
        this.learningProgressRepository = learningProgressRepository;
    }

    @Override
    public LearningProgress createProgress(LearningProgress progress) {
        progress.setStartedAt(LocalDateTime.now());
        progress.setLastUpdatedAt(LocalDateTime.now());
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
    public List<LearningProgress> getProgressByLearningPathId(String pathId) {
        return learningProgressRepository.findByLearningPathId(pathId);
    }

    @Override
    public Optional<LearningProgress> getProgressByUserAndPath(String userId, String pathId) {
        return learningProgressRepository.findByUserIdAndLearningPathId(userId, pathId);
    }

    @Override
    public LearningProgress updateProgress(LearningProgress progress) {
        progress.setLastUpdatedAt(LocalDateTime.now());
        return learningProgressRepository.save(progress);
    }

    @Override
    public void deleteProgress(String id) {
        learningProgressRepository.deleteById(id);
    }

    @Override
    public void completeMilestone(String progressId, LearningProgress.CompletedMilestone milestone) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            milestone.setCompletedAt(LocalDateTime.now());
            progress.getCompletedMilestones().add(milestone);
            progress.setLastUpdatedAt(LocalDateTime.now());
            learningProgressRepository.save(progress);
        }
    }

    @Override
    public void updateProgressPercentage(String progressId) {
        Optional<LearningProgress> progressOpt = learningProgressRepository.findById(progressId);
        if (progressOpt.isPresent()) {
            LearningProgress progress = progressOpt.get();
            // Logic to calculate percentage would typically involve
            // fetching the learning path to get total milestones
            // For now we'll just update the timestamp
            progress.setLastUpdatedAt(LocalDateTime.now());
            learningProgressRepository.save(progress);
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
        }
    }

    @Override
    public List<LearningProgress> getRecentProgressByUser(String userId) {
        return learningProgressRepository.findByUserIdOrderByLastUpdatedAtDesc(userId);
    }
}