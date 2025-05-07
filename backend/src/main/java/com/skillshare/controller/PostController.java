package com.skillshare.controller;

import com.skillshare.model.Post;
import com.skillshare.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(post -> new ResponseEntity<>(post, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable String userId) {
        return new ResponseEntity<>(postService.getPostsByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPostsByTitle(@RequestParam String title) {
        return new ResponseEntity<>(postService.searchPostsByTitle(title), HttpStatus.OK);
    }

    @GetMapping("/tags/{tag}")
    public ResponseEntity<List<Post>> getPostsByTag(@PathVariable String tag) {
        return new ResponseEntity<>(postService.getPostsByTag(tag), HttpStatus.OK);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Post>> getRecentPosts() {
        return new ResponseEntity<>(postService.getRecentPosts(), HttpStatus.OK);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Post>> getPopularPosts() {
        return new ResponseEntity<>(postService.getPopularPosts(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post, @RequestParam(required = false) String userId) {
        // Fetch the existing post
        Optional<Post> existingPost = postService.getPostById(id);

        // Check if post exists
        if (existingPost.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Check if the user is the author of the post
        Post currentPost = existingPost.get();
        if (userId != null && !userId.equals(currentPost.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Update the post
        post.setId(id);
        return new ResponseEntity<>(postService.updatePost(post), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, @RequestParam(required = false) String userId) {
        // Fetch the existing post
        Optional<Post> existingPost = postService.getPostById(id);
        
        // Check if post exists
        if (existingPost.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        // Check if the user is the author of the post
        Post currentPost = existingPost.get();
        if (userId != null && !userId.equals(currentPost.getUserId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable String id) {
        postService.likePost(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/share")
    public ResponseEntity<Void> sharePost(@PathVariable String id) {
        postService.sharePost(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Comment endpoints
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Post.Comment> addComment(
            @PathVariable String postId,
            @RequestBody Post.Comment comment,
            @RequestParam String userId) {
        
        // Validation
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Set metadata for the comment
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        Optional<Post> postOpt = postService.addCommentToPost(postId, comment);
        
        if (postOpt.isPresent()) {
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Post.Comment> updateComment(
            @PathVariable String postId, 
            @PathVariable String commentId,
            @RequestBody Map<String, String> payload,
            @RequestParam String userId) {
        
        String content = payload.get("content");
        
        // Validation
        if (content == null || content.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        Optional<Post.Comment> updatedCommentOpt = postService.updateCommentInPost(postId, commentId, userId, content);
        
        if (updatedCommentOpt.isPresent()) {
            return new ResponseEntity<>(updatedCommentOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String postId, 
            @PathVariable String commentId,
            @RequestParam String userId) {
        
        boolean deleted = postService.removeCommentFromPost(postId, commentId, userId);
        
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Optionally: Like a comment
    @PostMapping("/{postId}/comments/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable String postId, 
            @PathVariable String commentId) {
        
        boolean liked = postService.likeCommentInPost(postId, commentId);
        
        if (liked) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}