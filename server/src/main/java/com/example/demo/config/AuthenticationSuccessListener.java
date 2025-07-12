package com.example.demo.config;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.util.Map;


/**
 * A Spring Component (bean) that listens for successful logins
 * via Spring Security. Specifically, it hears the
 * InteractiveAuthenticationSuccessEvent whenever a user has
 * successfully authenticated (logged in).
 */
@Component
public class AuthenticationSuccessListener {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    /**
     * Constructor that logs a message when this bean is created.
     * Useful for verifying that Spring has detected and initialized this listener.
     */
    public AuthenticationSuccessListener() {
        System.out.println(">>>>> AuthenticationSuccessListener bean created!");
    }


    /**
     * This method listens for the InteractiveAuthenticationSuccessEvent,
     * which is triggered by Spring Security after a user is fully authenticated.
     * We can use this event to handle tasks such as creating or updating
     * the user's record in MongoDB.
     *
     * @param event The event object containing authentication details.
     */
    @EventListener
    public void onAuthenticationSuccess(InteractiveAuthenticationSuccessEvent event) {
        System.out.println(">>>>> InteractiveAuthenticationSuccessEvent fired!");
        // Retrieve the Authentication object from the event.
        Authentication authentication = event.getAuthentication();

        /**
         * Here, we check if the user logged in via OAuth2 (GitHub).
         * For GitHub OAuth, Spring Security typically uses an OAuth2AuthenticationToken,
         * and the principal is an OAuth2User containing GitHub profile attributes.
         */
        if(authentication instanceof OAuth2AuthenticationToken &&
            authentication.getPrincipal() instanceof OAuth2User) {

            // Get the OAuth2User holding GitHub user info.
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());

            String accessToken = client.getAccessToken().getTokenValue();
            // Extract the GitHub attributes (e.g. id, login, name, avatar_url, email).
            Map<String, Object> attributes = oAuth2User.getAttributes();

            // Extract GitHub user info (keys from GitHub's user API)
            String githubId = String.valueOf(attributes.get("id"));
            String login =  (String) attributes.get("login");
            String name = (String) attributes.get("name");
            String avatarUrl = (String) attributes.get("avatar_url");
            String email = (String) attributes.get("email");

            // Try to find an existing user with this GitHub ID; if not, create a new one.
            User user = userRepository.findByGithubId(githubId).orElse(new User());


            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = attr.getRequest();



            // Update fields
            user.setAccessToken(accessToken);
            user.setGithubId(githubId);
            user.setLogin(login);
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            // Only set email if it's not null (public email may be missing)
            if(email != null) {
                user.setEmail(email);
            }

            // Finally, save the user in the MongoDB 'users' collection.
            // If it doesn't exist, MongoDB will insert it.
            // If it does exist (same ID), it will update it.
            userRepository.save(user);

            // Log a message indicating success.
            System.out.println("User " + login + " successfully authenticated and stored in DB.");
        }
    }
}
