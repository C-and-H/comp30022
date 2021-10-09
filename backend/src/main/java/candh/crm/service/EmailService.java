package candh.crm.service;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class EmailService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${APP_URL}")
    private String APP_URL;

    /**
     * Send signup confirmation email.
     *
     * @param to  target email address
     * @param receiver  first name of the receiver
     */
    public void sendConfirmMail(String to, String receiver,
                                String signupConfirmPath) throws MessagingException
    {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setSubject("Confirm your signup for CandhCRM");
        helper.setFrom(from);
        helper.setTo(to);

        // message body
        String confirmLink = APP_URL + "/signup/" + to + "/" + signupConfirmPath;
        String messageBody = "Hi " + receiver + ", welcome to candhCRM.<br><br>You are nearly there!<br><br>" +
                "To finish setting up your account and start using candhCRM, confirm we've got the correct email for you:<br><br>" +
                "<a target='_blank' style='color:#0041D3;text-decoration:underline' href='" +
                confirmLink + "'>Click here to activate</a>" +
                "<br><img src='cid:logo' width='400' height='400'/>";   // logo

        helper.setText(messageBody, true);
        FileSystemResource resource = new FileSystemResource(new File("src/main/resources/logo.png"));
        helper.addInline("logo", resource);

        javaMailSender.send(message);
    }

    /**
     * Send an email from a user to another user.
     *
     * @param receiver  email addresses of the receivers, separated by comma
     * @param sender  name of the sender
     * @param title  subject of the email
     * @param content  content of the email
     * @param email  email address of the sender
     */
    public void sendEmail(String receiver, String sender, String title,
                                String content, String email) throws MessagingException
    {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setSubject(title);
        helper.setFrom(from);
        helper.setTo(InternetAddress.parse(receiver));

        // message body
        String messageBody = content +
                "\n\n==============================" +
                "\n\nForwarded by CandhCRM" +
                "\n\nFrom: " + sender + " (" + email + ")";

        helper.setText(messageBody, false);
        javaMailSender.send(message);
    }

    public void meetingInvitation(String hostId, String[] participantIds, Date startTime,
                                  Date endTime, String title, String notes) throws MessagingException
    {
        User host = userRepository.findById(hostId).get();
        List<User> participants = new ArrayList<>();
        for (String participantId : participantIds) {
            participants.add(userRepository.findById(participantId).get());
        }

        String receiver = participants.get(0).getEmail();
        if (participants.size() > 1) {
            for (int i = 1; i < participants.size(); i++) {
                receiver = receiver + ", " + participants.get(i).getEmail();
            }
        }

        String pattern = "MM/dd/yyyy HH:mm:ss";
        DateFormat df = new SimpleDateFormat(pattern);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setSubject("Meeting invitation");
        helper.setFrom(from);
        helper.setTo(InternetAddress.parse(receiver));

        // message body
        String messageBody = host.getName() + " has invited you to a meeting.\n" +
                "\nTitle: " + title +
                "\nTime: " + df.format(startTime) + " to " + df.format(endTime) + " GMT\n" +
                "\nNotes:\n" + notes;

        helper.setText(messageBody, false);
        javaMailSender.send(message);
    }
}
