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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    //need a way to reset all user stats every night at 11:59pm
}
