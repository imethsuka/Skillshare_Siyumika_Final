package com.agriapp.controller;

import com.agriapp.model.PlantingPlan;
import com.agriapp.service.PlantingPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "*")
public class PlantingPlanController {

    private final PlantingPlanService plantingPlanService;

    public PlantingPlanController(PlantingPlanService plantingPlanService) {
        this.plantingPlanService = plantingPlanService;
    }

    @PostMapping
    public ResponseEntity<PlantingPlan> createPlan(@RequestBody PlantingPlan plan) {
        return new ResponseEntity<>(plantingPlanService.createPlan(plan), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantingPlan> getPlanById(@PathVariable String id) {
        return plantingPlanService.getPlanById(id)
                .map(plan -> new ResponseEntity<>(plan, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<PlantingPlan>> getAllPlans() {
        return new ResponseEntity<>(plantingPlanService.getAllPlans(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<PlantingPlan>> getPlansByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(plantingPlanService.getPlansByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/public")
    public ResponseEntity<List<PlantingPlan>> getPublicPlans() {
        return new ResponseEntity<>(plantingPlanService.getPublicPlans(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlantingPlan>> searchPlansByTitle(@RequestParam String title) {
        return new ResponseEntity<>(plantingPlanService.searchPlansByTitle(title), HttpStatus.OK);
    }

    @GetMapping("/tags/{tag}")
    public ResponseEntity<List<PlantingPlan>> getPlansByTag(@PathVariable String tag) {
        return new ResponseEntity<>(plantingPlanService.getPlansByTag(tag), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantingPlan> updatePlan(@PathVariable String id, @RequestBody PlantingPlan plan) {
        plan.setId(id);
        return new ResponseEntity<>(plantingPlanService.updatePlan(plan), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        plantingPlanService.deletePlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<Void> addMilestone(@PathVariable String id, @RequestBody PlantingPlan.Milestone milestone) {
        plantingPlanService.addMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}/milestones/{milestoneId}")
    public ResponseEntity<Void> updateMilestone(@PathVariable String id, 
                                              @PathVariable String milestoneId,
                                              @RequestBody PlantingPlan.Milestone milestone) {
        milestone.setId(milestoneId);
        plantingPlanService.updateMilestone(id, milestone);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}/milestones/{milestoneId}")
    public ResponseEntity<Void> removeMilestone(@PathVariable String id, @PathVariable String milestoneId) {
        plantingPlanService.removeMilestone(id, milestoneId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likePlan(@PathVariable String id) {
        plantingPlanService.likePlan(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}