package com.agriapp.repository;

import com.agriapp.model.LearningPath;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningPathRepository extends MongoRepository<LearningPath, String> {
    List<LearningPath> findByUserId(String userId);
    List<LearningPath> findByIsPublic(boolean isPublic);
    List<LearningPath> findByTitleContainingIgnoreCase(String title);
    List<LearningPath> findByTagsContaining(String tag);
    List<LearningPath> findByUserIdAndIsPublic(String userId, boolean isPublic);
}