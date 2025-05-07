package com.skillshare.service.impl;

import com.skillshare.model.Post;
import com.skillshare.service.PostService;
import com.skillshare.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
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
        return postRepository.findAll();
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
        return postRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @Override
    public List<Post> getPopularPosts() {
        return postRepository.findTop10ByOrderByLikesDesc();
    }

    @Override
    public Post updatePost(Post post) {
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Override
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public void likePost(String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setLikes(post.getLikes() + 1);
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);
        }
    }

    @Override
    public void sharePost(String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setShares(post.getShares() + 1);
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);
        }
    }
}