package com.agriapp.service;

import com.agriapp.model.Post;
import java.util.List;
import java.util.Optional;

public interface PostService {
    Post createPost(Post post);
    Optional<Post> getPostById(String id);
    List<Post> getAllPosts();
    List<Post> getPostsByUserId(String userId);
    List<Post> searchPostsByTitle(String title);
    List<Post> getPostsByTag(String tag);
    List<Post> getRecentPosts();
    List<Post> getPopularPosts();
    Post updatePost(Post post);
    void deletePost(String id);
    void likePost(String postId);
    void sharePost(String postId);
}