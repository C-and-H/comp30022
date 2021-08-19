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
     * send signup confirmation email
     *
     * @param to      target email address
     * @param receiver username of receiver
     */
    public void sendConfirmMail(String to, String receiver) {
        SimpleMailMessage message = new SimpleMailMessage();

        String subject = "Sign up successfully!";
        String text = "Welcome " + receiver + " to our CRM system.";
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        javaMailSender.send(message);
    }
}
