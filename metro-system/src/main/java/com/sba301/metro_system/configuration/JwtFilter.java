package com.sba301.metro_system.configuration;

import com.sba301.metro_system.service.IJwtService;
import com.sba301.metro_system.service.implement.UserDetailService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    IJwtService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Check if this is a protected endpoint that requires authentication
        String path = request.getServletPath();
        String method = request.getMethod();
        boolean requiresAuth = isProtectedEndpoint(path, method);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            try {
                username = jwtService.extractUserName(token);
            } catch (ExpiredJwtException e) {
                System.out.println(e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            } catch (Exception e) {
                System.out.println(e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
        } else if (requiresAuth) {
            // No authorization header for a protected endpoint
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = context.getBean(UserDetailService.class).loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Determines if a request path requires authentication
     * 
     * @param path   The request path to check
     * @param method The HTTP method (GET, POST, etc.)
     * @return true if the path requires authentication, false otherwise
     */
    private boolean isProtectedEndpoint(String path, String method) {
        // Public URLs don't require authentication
        if (path.startsWith("/security/") ||
                path.startsWith("/swagger-ui/") ||
                path.equals("/swagger-ui.html") ||
                path.startsWith("/api-docs")) {
            return false;
        }

        // GET requests to stations are public
        if (path.startsWith("/stations") && "GET".equals(method)) {
            return false;
        }

        // Admin protected endpoints
        if (path.startsWith("/user/")) {
            return true;
        }

        // Protected station endpoints (POST, PUT, DELETE)
        if ((path.startsWith("/stations/") || path.equals("/stations")) &&
                !("GET".equals(method))) {
            return true;
        }

        // User protected endpoints
        if (path.startsWith("/account/")) {
            return true;
        }
        // By default, assume it's not protected
        return false;
    }
}
