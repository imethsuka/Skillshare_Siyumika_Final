package com.agriapp.repository;

import com.agriapp.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByUserId(String userId);
    List<Comment> findByReferenceTypeAndReferenceId(String referenceType, String referenceId);
    List<Comment> findByParentCommentId(String parentCommentId);
    List<Comment> findByReferenceTypeAndReferenceIdAndParentCommentIdIsNull(String referenceType, String referenceId);
    List<Comment> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(String referenceType, String referenceId);
}
