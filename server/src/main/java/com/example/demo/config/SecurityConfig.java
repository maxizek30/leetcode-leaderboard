package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * A configuration class that defines how Spring Security protects our application,
 * especially with OAuth2 (GitHub) login. Replaces the older WebSecurityConfigurerAdapter
 * style with the new SecurityFilterChain approach (Spring Security 5.7+).
 */
@Configuration
public class SecurityConfig {

    /**
     * Creates a SecurityFilterChain bean that Spring Security uses to decide:
     * - Which endpoints are publicly accessible
     * - Which endpoints require authentication
     * - How to handle OAuth2 login
     * - Logout configuration
     *
     * @param http The HttpSecurity object used to configure web-based security.
     * @return A fully configured SecurityFilterChain.
     * @throws Exception if an error occurs configuring security.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Step 1: Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Permit everyone to access "/", "/public/**", and the default "/error" page.
                        .requestMatchers("/", "/public/**", "/error", "/user/public/**").permitAll()
                        // For all other URLs, the user must be authenticated (logged in).
                        .anyRequest().authenticated()
                )
                // Step 2: Enable OAuth2 login with default settings.
                // This triggers the GitHub login flow if a user hits a protected endpoint while unauthenticated.
                .oauth2Login(oauth2 -> oauth2
                        // This will redirect to your React app after successful login
                        .defaultSuccessUrl("http://localhost:5173", true)
                )
                // Step 3: (Optional) Logout configuration
                .logout(logout -> logout
                        // After logging out, redirect the user to "/".
                        .logoutSuccessUrl("http://localhost:5173")
                        .permitAll()
                );
        // Build and return the configured SecurityFilterChain.
        return http.build();
    }
}
