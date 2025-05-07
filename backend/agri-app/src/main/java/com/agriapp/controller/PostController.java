package com.agriapp.controller;

import com.agriapp.model.Post;
import com.agriapp.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        post.setId(id);
        return new ResponseEntity<>(postService.updatePost(post), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
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
}