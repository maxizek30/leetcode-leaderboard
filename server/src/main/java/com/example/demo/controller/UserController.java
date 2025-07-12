package com.example.demo.controller;

import com.example.demo.models.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    /**
     * Returns the raw GitHub profile attributes (JSON) of the currently
     * authenticated user, if any.
     */
    @GetMapping("/profile")
    public Map<String, Object> getGithubProfile(@AuthenticationPrincipal OAuth2User principal) {
        return userService.getGithubProfile(principal);
    }
    /**
     * Fetches the current user's record from MongoDB using GitHub ID.
     */
    @GetMapping
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        return userService.getCurrentUser(principal);
    }
    /**
     * Private endpoint to delete user
     */
    @DeleteMapping
    public ResponseEntity<String> deleteCurrentUser(@AuthenticationPrincipal OAuth2User principal, HttpServletRequest request, HttpServletResponse response) {
        boolean deleted =  userService.deleteUser(principal);
        if(deleted) {
            request.getSession().invalidate();
            return ResponseEntity.ok("User deleted and logged out.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }
    /**
     * Public endpoint to fetch all users.
     */
    @GetMapping("/public/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    /**
     * Public endpoint (no login needed).
     */
    @GetMapping("/public/hello")
    public String helloPublic() {
        return userService.helloPublic();
    }
    //need an enpoint to reset user stats
    @GetMapping("/public/reset-all")
    public ResponseEntity<String> resetAllUserStatsPublic() {
        userService.resetAllUserStats();
        return ResponseEntity.ok("✅ All user stats reset successfully (from public endpoint).");
    }
    @GetMapping("/auth-status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(@AuthenticationPrincipal OAuth2User principal, HttpServletRequest request) {
        System.out.println("🔍 /auth-status called from IP: " + request.getRemoteAddr());
        System.out.println("🔍 Request Origin: " + request.getHeader("Origin"));
        System.out.println("🔍 Request Cookie header: " + request.getHeader("Cookie"));
        System.out.println("🔍 Principal is null: " + (principal == null));

        if (principal != null) {
            System.out.println("✅ User is authenticated");
            System.out.println("🔍 Principal name: " + principal.getName());
            System.out.println("🔍 Principal attributes: " + principal.getAttributes());
        }

        Map<String, Object> response = new HashMap<>();

        try {
            if (principal != null) {
                User user = userService.getCurrentUser(principal);
                System.out.println("🔍 User from service: " + (user != null ? user.getLogin() : "null"));

                response.put("authenticated", true);
                response.put("user", user);
            } else {
                System.out.println("❌ User is not authenticated - principal is null");
                response.put("authenticated", false);
                response.put("user", null);
            }

            System.out.println("🔍 Response: " + response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("💥 Error in getAuthStatus: " + e.getMessage());
            e.printStackTrace();
            response.put("authenticated", false);
            response.put("user", null);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @PutMapping("/leetcode-username")
    public ResponseEntity<Map<String, Object>> updateLeetcodeUsername(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, String> requestBody) {

        System.out.println("🔍 /leetcode-username PUT called");

        Map<String, Object> response = new HashMap<>();

        try {
            if (principal == null) {
                System.out.println("❌ User not authenticated");
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String newLeetcodeUsername = requestBody.get("leetcodeUsername");

            if (newLeetcodeUsername == null || newLeetcodeUsername.trim().isEmpty()) {
                System.out.println("❌ Invalid leetcode username provided");
                response.put("success", false);
                response.put("message", "LeetCode username cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            User updatedUser = userService.updateLeetcodeUsername(principal, newLeetcodeUsername.trim());

            if (updatedUser != null) {
                System.out.println("✅ LeetCode username updated successfully");
                response.put("success", true);
                response.put("message", "LeetCode username updated and snapshot created successfully");
                response.put("user", updatedUser);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Failed to update leetcode username");
                response.put("success", false);
                response.put("message", "Failed to update LeetCode username or create snapshot");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            System.out.println("💥 Error in updateLeetcodeUsername: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred while updating LeetCode username");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    //need a way to reset all user stats every night at 11:59pm
}
