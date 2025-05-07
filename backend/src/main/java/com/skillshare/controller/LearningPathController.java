package com.skillshare.controller;

import com.skillshare.model.LearningPath;
import com.skillshare.service.LearningPathService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paths")
@CrossOrigin(origins = "*")
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }

    @PostMapping
    public ResponseEntity<LearningPath> createPath(@RequestBody LearningPath path) {
        return new ResponseEntity<>(learningPathService.createPath(path), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPath> getPathById(@PathVariable String id) {
        return learningPathService.getPathById(id)
                .map(path -> new ResponseEntity<>(path, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<LearningPath>> getAllPaths() {
        return new ResponseEntity<>(learningPathService.getAllPaths(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<LearningPath>> getPathsByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(learningPathService.getPathsByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/public")
    public ResponseEntity<List<LearningPath>> getPublicPaths() {
        return new ResponseEntity<>(learningPathService.getPublicPaths(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LearningPath>> searchPathsByTitle(@RequestParam String title) {
        return new ResponseEntity<>(learningPathService.searchPathsByTitle(title), HttpStatus.OK);
    }

    @GetMapping("/tags/{tag}")
    public ResponseEntity<List<LearningPath>> getPathsByTag(@PathVariable String tag) {
        return new ResponseEntity<>(learningPathService.getPathsByTag(tag), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPath> updatePath(@PathVariable String id, @RequestBody LearningPath path) {
        path.setId(id);
        return new ResponseEntity<>(learningPathService.updatePath(path), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePath(@PathVariable String id) {
        learningPathService.deletePath(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<Void> addMilestone(@PathVariable String id, @RequestBody LearningPath.Milestone milestone) {
        learningPathService.addMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}/milestones/{milestoneId}")
    public ResponseEntity<Void> updateMilestone(@PathVariable String id, 
                                              @PathVariable String milestoneId,
                                              @RequestBody LearningPath.Milestone milestone) {
        milestone.setId(milestoneId);
        learningPathService.updateMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}/milestones/{milestoneId}")
    public ResponseEntity<Void> removeMilestone(@PathVariable String id, @PathVariable String milestoneId) {
        learningPathService.removeMilestone(id, milestoneId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likePath(@PathVariable String id) {
        learningPathService.likePath(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}