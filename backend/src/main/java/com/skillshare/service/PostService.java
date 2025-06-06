package com.skillshare.service;

import com.skillshare.model.Post;
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
    void likePost(String id);
    void sharePost(String id);
    
    // Comment related methods
    Optional<Post> addCommentToPost(String postId, Post.Comment comment);
    Optional<Post.Comment> updateCommentInPost(String postId, String commentId, String userId, String content);
    boolean removeCommentFromPost(String postId, String commentId, String userId);
    boolean likeCommentInPost(String postId, String commentId);
}