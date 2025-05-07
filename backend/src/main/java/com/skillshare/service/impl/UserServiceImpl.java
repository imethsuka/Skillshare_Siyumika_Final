package com.skillshare.service.impl;

import com.skillshare.model.User;
import com.skillshare.repository.UserRepository;
import com.skillshare.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Base64;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        // In a real application, you would hash the password before storing it
        // user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(User user) {
        // Check if user exists before updating
        Optional<User> existingUserOpt = userRepository.findById(user.getId());

        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + user.getId());
        }

        User existingUser = existingUserOpt.get();

        // Update user fields but preserve sensitive information
        if (user.getUsername() != null) {
            // If username is changing, check if the new username is already taken
            if (!existingUser.getUsername().equals(user.getUsername()) &&
                    userRepository.existsByUsername(user.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            existingUser.setUsername(user.getUsername());
        }

        if (user.getEmail() != null) {
            // If email is changing, check if the new email is already taken
            if (!existingUser.getEmail().equals(user.getEmail()) &&
                    userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            existingUser.setEmail(user.getEmail());
        }

        // Update non-sensitive fields
        if (user.getProfilePicture() != null) {
            existingUser.setProfilePicture(user.getProfilePicture());
        }

        // Only update password if it's provided and not empty
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            // In production, you should use password hashing here
            // existingUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            existingUser.setPassword(user.getPassword());
        }

        // Update other fields as needed
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(String id) {
        // Check if user exists
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        // In a real application, you might want to:
        // 1. Delete or anonymize user's posts
        // 2. Delete or anonymize user's comments
        // 3. Remove user from followers/following lists
        // 4. Handle any other related data

        // For now, simply delete the user
        userRepository.deleteById(id);

        // Log the deletion for audit purposes
        System.out.println("User deleted: " + id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void addBadge(String userId, String badge) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getBadges().contains(badge)) {
                user.getBadges().add(badge);
                userRepository.save(user);
            }
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    @Override
    public void followUser(String userId, String followedUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getFollowingUsers().contains(followedUserId)) {
                user.getFollowingUsers().add(followedUserId);
                userRepository.save(user);
            }
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    @Override
    public void unfollowUser(String userId, String unfollowedUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.getFollowingUsers().remove(unfollowedUserId);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    @Override
    public String generateToken(User user) {
        // In a real application, you would use a JWT library like jjwt
        // This is a simplified version for demonstration

        // Create a payload with user ID and username
        String payload = user.getId() + ":" + user.getUsername() + ":" + System.currentTimeMillis();

        // For production, use a secure encoding with signatures
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }

    @Override
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        // For basic authentication, compare passwords directly
        // In a production app, you would use BCrypt: return
        // bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
        return rawPassword.equals(encodedPassword);
    }

    @Override
    public User getUserFromToken(String token) {
        try {
            // Decode the Base64 token
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decodedToken = new String(decodedBytes);

            // Extract the user ID from the token (format is "userId:username:timestamp")
            String[] parts = decodedToken.split(":");
            if (parts.length < 2) {
                return null;
            }

            String userId = parts[0];

            // Get the user from the repository
            return userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            // If there's any error in decoding or finding the user, return null
            return null;
        }
    }
}