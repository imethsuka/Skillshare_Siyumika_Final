package com.agriapp.service.impl;

import com.agriapp.model.Post;
import com.agriapp.repository.CommentRepository;
import com.agriapp.repository.PostRepository;
import com.agriapp.service.PostService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostServiceImpl(PostRepository postRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Override
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Override
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            List<com.agriapp.model.Comment> comments = commentRepository.findByReferenceTypeAndReferenceId("POST", post.getId());
            post.setComments(comments); // Add a `setComments` method in the `Post` model
        }
        return posts;
    }

    @Override
    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    @Override
    public List<Post> searchPostsByTitle(String title) {
        return postRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Post> getPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }

    @Override
    public List<Post> getRecentPosts() {
        return postRepository.findByOrderByCreatedAtDesc();
    }

    @Override
    public List<Post> getPopularPosts() {
        return postRepository.findByOrderByLikesDesc();
    }

    @Override
    public Post updatePost(Post post) {
        if (!postRepository.existsById(post.getId())) {
            throw new RuntimeException("Post not found with ID: " + post.getId());
        }
        
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Override
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public void likePost(String postId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found with ID: " + postId);
        }
    }

    @Override
    public void sharePost(String postId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setShares(post.getShares() + 1);
            postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found with ID: " + postId);
        }
    }
}