package com.agriapp.repository;

import com.agriapp.model.PlantingPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlantingPlanRepository extends MongoRepository<PlantingPlan, String> {
    List<PlantingPlan> findByUserId(String userId);
    List<PlantingPlan> findByIsPublic(boolean isPublic);
    List<PlantingPlan> findByTitleContainingIgnoreCase(String title);
    List<PlantingPlan> findByTagsContaining(String tag);
    List<PlantingPlan> findByUserIdAndIsPublic(String userId, boolean isPublic);
}
