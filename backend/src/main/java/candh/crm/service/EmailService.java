package candh.crm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

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
     * @param to        target email address
     * @param receiver  first name of the receiver
     */
    public void sendConfirmMail(String to, String receiver,
                                String signupConfirmPath) throws MessagingException
    {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        String subject = "Confirm your signup for candhCRM";
        message.setSubject(subject);

        // message body
        String confirmLink = System.getenv("HOST_NAME") + "/signup/" + to + "/" + signupConfirmPath;
        String messageBody = "Hi " + receiver + ", welcome to candhCRM.<br>You are nearly there!<br>" +
                "To finish setting up your account and start using candhCRM, confirm we've got the correct email for you:<br>" +
                "<a target='_blank' style='color:#0041D3;text-decoration:underline' href='" +
                confirmLink + "'>Click here to activate</a>";

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(messageBody,"UTF-8","html");
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        message.setContent(multipart);

        javaMailSender.send(message);
    }
}
