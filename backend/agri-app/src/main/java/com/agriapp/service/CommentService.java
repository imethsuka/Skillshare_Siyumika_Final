package com.agriapp.service;

import com.agriapp.model.Comment;
import java.util.List;
import java.util.Optional;

public interface CommentService {
    Comment createComment(Comment comment);
    Optional<Comment> getCommentById(String id);
    List<Comment> getAllComments();
    List<Comment> getCommentsByUserId(String userId);
    List<Comment> getCommentsByReference(String referenceType, String referenceId);
    List<Comment> getTopLevelCommentsByReference(String referenceType, String referenceId);
    List<Comment> getRepliesByParentCommentId(String parentCommentId);
    Comment updateComment(Comment comment);
    void deleteComment(String id);
    void likeComment(String commentId);
}