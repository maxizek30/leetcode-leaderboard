package com.example.demo.service;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns GitHub profile attributes if the user is authenticated.
     */
    public Map<String, Object> getGithubProfile(OAuth2User principal) {
        return principal != null ? principal.getAttributes() : null;
    }

    /**
     * Fetches the user from DB by GitHub ID.
     */
    public User getCurrentUser(OAuth2User principal) {
        if (principal == null) return null;

        String githubId = String.valueOf(principal.getAttributes().get("id"));
        Optional<User> userOpt = userRepository.findByGithubId(githubId);
        return userOpt.orElse(null);
    }

    /**
     * Fetch all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    /**
     * delete user account from database
     */
    public boolean deleteUser(OAuth2User principal) {
        if (principal == null) return false;

        String githubId = String.valueOf(principal.getAttributes().get("id"));
        Optional<User> userOpt = userRepository.findByGithubId(githubId);

        if(userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return true;
        }
        return false;
    }
    /**
     * reset all user stats
     */
    public void resetAllUserStats() {
        Date currentDate = new Date();
        //for each user
        List<User> users = userRepository.findAll();
        for (User user : users) {
            //fetch their current stats
            Map<String, Object> newUserInfo = fetchUserStats(user.getLeetcodeUsername());

            //if we cannot fetch a user stat then
            if (newUserInfo.isEmpty()) {
                // we keep the stats the same as it was in the current db and flag the user
                user.setUserFlagged(true);
                user.setSnapShotDate(currentDate);

            } else {
                //update the user
                user.setUserFlagged(false);
                user.setSnapShotDate(currentDate);
                user.setSnapshotEasyCount((int) newUserInfo.get("easySolved"));
                user.setSnapshotMediumCount((int) newUserInfo.get("mediumSolved"));
                user.setSnapshotHardCount((int) newUserInfo.get("hardSolved"));
            }
        }
        userRepository.saveAll(users);
    }
    /**
     * fetch user stat, fetch a user stat for an individual
     */
    public Map<String, Object> fetchUserStats(String leetcodeUsername) {
        String url = "https://alfa-leetcode-api.onrender.com/" + leetcodeUsername + "/solved";

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        if(response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            return Collections.emptyMap();
        }
    }

    /**
     * Example of simple public service method.
     */
    public String helloPublic() {
        return "Hello from a public endpoint!";
    }
}
