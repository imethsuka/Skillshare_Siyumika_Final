package com.agriapp.controller;

import com.agriapp.model.PlantProgress;
import com.agriapp.service.PlantProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class PlantProgressController {

    private final PlantProgressService plantProgressService;

    public PlantProgressController(PlantProgressService plantProgressService) {
        this.plantProgressService = plantProgressService;
    }

    @PostMapping
    public ResponseEntity<PlantProgress> createProgress(@RequestBody PlantProgress progress) {
        return new ResponseEntity<>(plantProgressService.createProgress(progress), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantProgress> getProgressById(@PathVariable String id) {
        return plantProgressService.getProgressById(id)
                .map(progress -> new ResponseEntity<>(progress, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<PlantProgress>> getAllProgress() {
        return new ResponseEntity<>(plantProgressService.getAllProgress(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<PlantProgress>> getProgressByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(plantProgressService.getProgressByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/plans/{planId}")
    public ResponseEntity<List<PlantProgress>> getProgressByPlantingPlanId(@PathVariable String planId) {
        return new ResponseEntity<>(plantProgressService.getProgressByPlantingPlanId(planId), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/plans/{planId}")
    public ResponseEntity<PlantProgress> getProgressByUserAndPlan(@PathVariable String userId, @PathVariable String planId) {
        return plantProgressService.getProgressByUserAndPlan(userId, planId)
                .map(progress -> new ResponseEntity<>(progress, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantProgress> updateProgress(@PathVariable String id, @RequestBody PlantProgress progress) {
        progress.setId(id);
        return new ResponseEntity<>(plantProgressService.updateProgress(progress), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        plantProgressService.deleteProgress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<Void> completeMilestone(@PathVariable String id, @RequestBody PlantProgress.CompletedMilestone milestone) {
        plantProgressService.completeMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/percentage")
    public ResponseEntity<Void> updateProgressPercentage(@PathVariable String id) {
        plantProgressService.updateProgressPercentage(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/badges/{badge}")
    public ResponseEntity<Void> awardBadge(@PathVariable String id, @PathVariable String badge) {
        plantProgressService.awardBadge(id, badge);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likeProgress(@PathVariable String id) {
        plantProgressService.likeProgress(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/recent")
    public ResponseEntity<List<PlantProgress>> getRecentProgressByUser(@PathVariable String userId) {
        return new ResponseEntity<>(plantProgressService.getRecentProgressByUser(userId), HttpStatus.OK);
    }
}