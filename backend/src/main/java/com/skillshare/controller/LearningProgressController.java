package com.skillshare.controller;

import com.skillshare.model.LearningProgress;
import com.skillshare.service.LearningProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class LearningProgressController {

    private final LearningProgressService learningProgressService;

    public LearningProgressController(LearningProgressService learningProgressService) {
        this.learningProgressService = learningProgressService;
    }

    @PostMapping
    public ResponseEntity<LearningProgress> createProgress(@RequestBody LearningProgress progress) {
        return new ResponseEntity<>(learningProgressService.createProgress(progress), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningProgress> getProgressById(@PathVariable String id) {
        return learningProgressService.getProgressById(id)
                .map(progress -> new ResponseEntity<>(progress, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<LearningProgress>> getAllProgress() {
        return new ResponseEntity<>(learningProgressService.getAllProgress(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<LearningProgress>> getProgressByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(learningProgressService.getProgressByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/paths/{pathId}")
    public ResponseEntity<List<LearningProgress>> getProgressByLearningPathId(@PathVariable String pathId) {
        return new ResponseEntity<>(learningProgressService.getProgressByLearningPathId(pathId), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/paths/{pathId}")
    public ResponseEntity<LearningProgress> getProgressByUserAndPath(@PathVariable String userId, @PathVariable String pathId) {
        return learningProgressService.getProgressByUserAndPath(userId, pathId)
                .map(progress -> new ResponseEntity<>(progress, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateProgress(@PathVariable String id, @RequestBody LearningProgress progress) {
        progress.setId(id);
        return new ResponseEntity<>(learningProgressService.updateProgress(progress), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        learningProgressService.deleteProgress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<Void> completeMilestone(@PathVariable String id, @RequestBody LearningProgress.CompletedMilestone milestone) {
        learningProgressService.completeMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/percentage")
    public ResponseEntity<Void> updateProgressPercentage(@PathVariable String id) {
        learningProgressService.updateProgressPercentage(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/badges/{badge}")
    public ResponseEntity<Void> awardBadge(@PathVariable String id, @PathVariable String badge) {
        learningProgressService.awardBadge(id, badge);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likeProgress(@PathVariable String id) {
        learningProgressService.likeProgress(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/recent")
    public ResponseEntity<List<LearningProgress>> getRecentProgressByUser(@PathVariable String userId) {
        return new ResponseEntity<>(learningProgressService.getRecentProgressByUser(userId), HttpStatus.OK);
    }
}