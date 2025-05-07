package com.skillshare.repository;

import com.skillshare.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    List<Post> findByTitleContainingIgnoreCase(String title);
    List<Post> findByTagsContaining(String tag);
    List<Post> findTop10ByOrderByCreatedAtDesc();
    List<Post> findTop10ByOrderByLikesDesc();
}