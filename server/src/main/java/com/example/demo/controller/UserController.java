package com.example.demo.controller;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;


    /**
     * Returns the raw GitHub profile attributes (JSON) of the currently
     * authenticated user, if any. This lets us see exactly what GitHub
     * data Spring Security is providing (e.g. id, login, name, avatar_url).
     *
     * @param principal Injected by Spring Security when the user is logged in.
     *                  It's an OAuth2User containing the GitHub user data.
     * @return A Map of user attributes (or null if not authenticated).
     */    @GetMapping("/profile")
    public Map<String, Object> getGithubProfile(@AuthenticationPrincipal OAuth2User principal) {
        // If principal is non-null, return all attributes. Otherwise, return null.
        return principal != null ? principal.getAttributes() : null;
    }


    /**
     * Fetches the current user's record from our MongoDB database (not from GitHub).
     * We identify the user by their GitHub "id" field, which is unique.
     *
     * @param principal The authenticated GitHub user (injected by Spring Security).
     * @return The corresponding User object from MongoDB, or null if not found or not logged in.
     */
    @GetMapping
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        // If there's no authenticated user, return null immediately.
        if(principal == null) return null;

        // Extract the GitHub user ID from the OAuth2User's attributes.
        String githubId = String.valueOf(principal.getAttributes().get("id"));
        // Use the UserRepository to find a user in MongoDB with this GitHub ID.
        Optional<User> userOpt = userRepository.findByGithubId(githubId);
        // If present, return that user object; otherwise return null.
        return userOpt.orElse(null);
    }

    /**
     * Public endpoint to fetch all users
     * @return List of all users
     */
    @GetMapping("/public/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Example of a public endpoint (no login needed)
    @GetMapping("/public/hello")
    public String helloPublic() {
        return "Hello from a public endpoint!";
    }




}
