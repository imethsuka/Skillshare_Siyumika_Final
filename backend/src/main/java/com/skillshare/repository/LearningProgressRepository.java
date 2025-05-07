package com.skillshare.repository;

import com.skillshare.model.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    List<LearningProgress> findByLearningPathId(String pathId);
    Optional<LearningProgress> findByUserIdAndLearningPathId(String userId, String pathId);
    List<LearningProgress> findByUserIdOrderByLastUpdatedAtDesc(String userId);
}