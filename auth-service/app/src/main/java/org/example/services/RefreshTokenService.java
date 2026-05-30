package org.example.services;

import org.example.entities.RefreshToken;
import org.example.entities.UserInfo;
import org.example.repository.RefreshTokenRepository;
import org.example.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    private static final long REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000L; // 7 days

    // ✅ SIGNUP — User is new, directly create and insert refresh token, no DB lookup needed
    @Transactional
    public RefreshToken createRefreshTokenForSignup(String username) {
        UserInfo userInfo = userInfoRepository.findByUserName(username);
        RefreshToken refreshToken = new RefreshToken(); // Always fresh, no orElse needed

        refreshToken.setUserInfo(userInfo);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRY_MS));

        return refreshTokenRepository.save(refreshToken); // Always INSERT
    }

    @Transactional
    public RefreshToken replaceRefreshTokenForLogin(String username) {
        UserInfo userInfo = userInfoRepository.findByUserName(username);

        // For login, token MUST exist in DB already, find it and overwrite
        RefreshToken refreshToken = refreshTokenRepository
                .findByUserInfo(userInfo)
                .orElse(new RefreshToken()); // Edge case: first-ever login, no token yet

        refreshToken.setUserInfo(userInfo);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRY_MS));

        return refreshTokenRepository.save(refreshToken); // UPDATE if found, INSERT if edge case
    }

    public RefreshToken verifyExpiration(RefreshToken refreshToken) {
        if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException(refreshToken.getToken() + " refresh token got expired, please login once again");
        }
        return refreshToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
}
