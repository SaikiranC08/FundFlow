package org.example.Controller;

import lombok.extern.slf4j.Slf4j;
import org.example.entities.RefreshToken;
import org.example.model.UserInfoDto;
import org.example.request.ChangePasswordRequest;
import org.example.response.JwtResponseDTO;
import org.example.services.JwtService;
import org.example.services.RefreshTokenService;
import org.example.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.example.entities.UserInfo;
import org.example.repository.UserInfoRepository;

@RestController
@RequestMapping("/v1")
@Slf4j
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private UserInfoRepository userInfoRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> Signup(@RequestBody UserInfoDto userInfoDto) {
        try {
            log.info("Received signup request for username: '{}', email: '{}'", 
                    userInfoDto.getUserName(), userInfoDto.getEmail());

            Boolean isSigned = userDetailsService.siginupUser(userInfoDto);

            if (Boolean.FALSE.equals(isSigned)) {
                return new ResponseEntity<>("Already user exists", HttpStatus.BAD_REQUEST);
            }

            RefreshToken refreshToken = refreshTokenService.createRefreshTokenForSignup(userInfoDto.getUserName());
            String jwtToken = jwtService.GenerateToken(userInfoDto.getUserName());

            return new ResponseEntity<>(JwtResponseDTO.builder()
                    .accessToken(jwtToken)
                    .token(refreshToken.getToken())
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Exception in signup process for user: {}", userInfoDto.getUserName(), e);
            return new ResponseEntity<>("Exception in User Service: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {
        String username = authentication.getName();
        request.setUsername(username);
        return ResponseEntity.ok(userDetailsService.changePassword(request));
    }
    
    // Debug endpoint to check users in database
    @GetMapping("/debug/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserInfo> users = StreamSupport.stream(userInfoRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());
            
            if (users.isEmpty()) {
                return ResponseEntity.ok("No users found in database");
            }
            
            return ResponseEntity.ok(users.stream().map(user -> {
                return "UserID: " + user.getUserId() +
                       ", Username: " + user.getUserName() + 
                       ", Email: " + user.getEmail() + 
                       ", Phone: " + user.getPhoneNumber() + 
                       ", Password: " + (user.getPassword() != null ? "[ENCRYPTED]" : "[NULL]");
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            log.error("Error retrieving users in debug endpoint", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // Debug endpoint to show database tables info
    @GetMapping("/debug/info")
    public ResponseEntity<?> getDatabaseInfo() {
        return ResponseEntity.ok("Database: authservice at 192.168.64.4:3306\n" +
                                "Main table: Users (contains user_id, user_name, email, phone_number, password)\n" +
                                "Related tables: users_roles, roles, refresh_token");
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                     .body("Missing token");
            }

            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            return ResponseEntity.ok(username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Invalid token");
        }
    }
}
