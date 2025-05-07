package com.skillshare.controller;

import com.skillshare.model.Comment;
import com.skillshare.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        return new ResponseEntity<>(commentService.createComment(comment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(comment -> new ResponseEntity<>(comment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return new ResponseEntity<>(commentService.getAllComments(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(commentService.getCommentsByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/references")
    public ResponseEntity<List<Comment>> getCommentsByReference(
            @RequestParam String referenceType, 
            @RequestParam String referenceId) {
        return new ResponseEntity<>(
            commentService.getCommentsByReference(referenceType, referenceId), 
            HttpStatus.OK
        );
    }

    @GetMapping("/top-level/references")
    public ResponseEntity<List<Comment>> getTopLevelCommentsByReference(
            @RequestParam String referenceType, 
            @RequestParam String referenceId) {
        return new ResponseEntity<>(
            commentService.getTopLevelCommentsByReference(referenceType, referenceId), 
            HttpStatus.OK
        );
    }

    @GetMapping("/replies/{parentId}")
    public ResponseEntity<List<Comment>> getRepliesByParentCommentId(@PathVariable String parentId) {
        return new ResponseEntity<>(
            commentService.getRepliesByParentCommentId(parentId), 
            HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment comment) {
        comment.setId(id);
        return new ResponseEntity<>(commentService.updateComment(comment), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likeComment(@PathVariable String id) {
        commentService.likeComment(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}