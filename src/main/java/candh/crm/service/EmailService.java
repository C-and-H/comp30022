package candh.crm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService
{
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String from;

    /**
     * Send signup confirmation email.
     *
     * @param to      target email address
     * @param receiver username of receiver
     */
    public void sendConfirmMail(String to, String receiver, String signupConfirmPath) {
        SimpleMailMessage message = new SimpleMailMessage();
        String subject = "Confirm your signup for CandH CRM";
        // TODO: Change link URL
        String text = "Welcome " + receiver + " to our CRM system.\n\n" +
                "Click the link below, confirm your signup, and you get started.\n" +
                "localhost:8080/signup/" + to + "/" + signupConfirmPath;
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }
}
