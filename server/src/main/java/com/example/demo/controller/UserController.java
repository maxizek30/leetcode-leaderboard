package com.example.demo.controller;

import com.example.demo.models.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
}
