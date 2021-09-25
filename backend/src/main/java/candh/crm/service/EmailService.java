package candh.crm.service;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
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
        message.setFrom(new InternetAddress(from));
        InternetAddress[] to = InternetAddress.parse(receiver);
        message.addRecipients(MimeMessage.RecipientType.TO, to);
        message.setSubject(title);

        // message body
        String messageBody = content + "\n\nSend from: " + sender
                            + "\nSender's email: " + email;

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(messageBody);
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        message.setContent(multipart);

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
        message.setFrom(new InternetAddress(from));
        InternetAddress[] to = InternetAddress.parse(receiver);
        message.addRecipients(MimeMessage.RecipientType.TO, to);
        message.setSubject("Meeting invitation");

        // message body
        String messageBody = host.getName() + " has invited you to a meeting. \nTitle: " + title
                                + " \nTime: " + df.format(startTime) + " to "
                                + df.format(endTime) + " \nNotes: " + notes;

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setText(messageBody);
        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        message.setContent(multipart);

        javaMailSender.send(message);
    }
}
