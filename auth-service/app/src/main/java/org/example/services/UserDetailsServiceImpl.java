package org.example.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entities.UserInfo;
import org.example.model.UserInfoDto;
import org.example.repository.UserInfoRepository;
import org.example.request.ChangePasswordRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Objects;
import java.util.UUID;

@Component
@AllArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo user = userInfoRepository.findByUserName(username);
        if (user == null) {
            throw new RuntimeException("could not found user ...");
        }
        return new CustomUserDetails(user);
    }

    public UserInfo checkIfUserExists(UserInfoDto userInfoDto) {
        return userInfoRepository.findByUserName(userInfoDto.getUserName());
    }

    // validating email
    public boolean validateEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && email.matches(emailRegex);
    }

    // validating phone number
    public boolean validateNumber(String number) {
        if (number == null || number.trim().isEmpty()) {
            log.warn("Phone number validation failed: number is null or empty");
            return false;
        }
        
        // Remove any spaces and trim
        String cleanNumber = number.trim().replaceAll("\\s+", "");
        log.info("Validating phone number: '{}'", cleanNumber);
        
        // Allow formats: +1234567890, 1234567890, +91234567890 etc (10-15 digits total)
        String regex = "^\\+?[0-9]{10,15}$";
        boolean isValid = cleanNumber.matches(regex);
        log.info("Phone number validation result for '{}': {}", cleanNumber, isValid);
        return isValid;
    }

    public boolean siginupUser(UserInfoDto userInfoDto) {
        // validation
        if (!validateEmail(userInfoDto.getEmail())) {
            throw new IllegalArgumentException("Invalid email format!");
        }
        if (!validateNumber(userInfoDto.getPhoneNumber())) {
            throw new IllegalArgumentException("Invalid phone number");
        }

        userInfoDto.setPassword(passwordEncoder.encode(userInfoDto.getPassword()));
        if (Objects.nonNull(checkIfUserExists(userInfoDto))) {
            return false;
        }
        String userId = UUID.randomUUID().toString();
        userInfoRepository.save(new UserInfo(userId, userInfoDto.getUserName(), userInfoDto.getPassword(),
                userInfoDto.getEmail(), userInfoDto.getPhoneNumber(), new HashSet<>()));

        return true;
    }

    public String changePassword(ChangePasswordRequest request) {
        UserInfo user = userInfoRepository.findByUserName(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        boolean matches = passwordEncoder.matches(request.getOldPassword(), user.getPassword());
        if (!matches) {
            throw new RuntimeException("Current password is incorrect");
        }

        // PASSWORD VALIDATION
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userInfoRepository.save(user);

        return "Password updated successfully";
    }
}
