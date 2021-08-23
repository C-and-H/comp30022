package candh.crm.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomizeAuthenticationSuccessHandler implements AuthenticationSuccessHandler
{
    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse, Authentication authentication)
            throws IOException, ServletException {
        httpServletResponse.setStatus(httpServletResponse.SC_OK);
        httpServletResponse.sendRedirect("/api/dashboard");
    }
}
