package com.agriapp.repository;

import com.agriapp.model.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    List<LearningProgress> findByLearningPathId(String learningPathId);
    Optional<LearningProgress> findByUserIdAndLearningPathId(String userId, String learningPathId);
    List<LearningProgress> findByProgressPercentage(double progressPercentage);
    List<LearningProgress> findByUserIdOrderByLastUpdatedAtDesc(String userId);
}