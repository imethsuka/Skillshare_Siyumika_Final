package com.agriapp.service;

import com.agriapp.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(String id);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    User updateUser(User user);
    void deleteUser(String id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void addBadge(String userId, String badge);
    void followUser(String userId, String followedUserId);
    void unfollowUser(String userId, String unfollowedUserId);
    String generateToken(User createdUser);
    boolean validatePassword(String password, String password2);
    User getUserFromToken(String token);
}