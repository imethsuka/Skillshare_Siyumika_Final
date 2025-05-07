package com.agriapp.repository;

import com.agriapp.model.PlantProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlantProgressRepository extends MongoRepository<PlantProgress, String> {
    List<PlantProgress> findByUserId(String userId);
    List<PlantProgress> findByPlantingPlanId(String plantingPlanId);
    Optional<PlantProgress> findByUserIdAndPlantingPlanId(String userId, String plantingPlanId);
    List<PlantProgress> findByProgressPercentage(double progressPercentage);
    List<PlantProgress> findByUserIdOrderByLastUpdatedAtDesc(String userId);
}
