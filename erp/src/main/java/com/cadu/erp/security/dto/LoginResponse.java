package com.cadu.erp.security.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Long expiresIn;
    private String username;
    private java.util.List<String> permissions;
} 