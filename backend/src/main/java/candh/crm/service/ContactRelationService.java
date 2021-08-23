package candh.crm.service;

import candh.crm.model.Contact;
import candh.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class ContactRelationService {

    @Autowired
    private ContactRepository contactRepository;

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    /**
     * Find the contact list
     * @param user the email of user
     * @return all Contacts of the user
     */
    public List<Contact> findAllFriends(String user) {
        return contactRepository.findByUser(user);
    }

    /**
     * find contactRelation by user's and friend's emails
     * @param user email of user
     * @param friend email of friend
     * @return contact found or Optional.empty() is not found
     */
    public Optional<Contact> findByUserAndFriend(String user, String friend) {
        return contactRepository.findByUserAndFriend(user, friend);
    }

    /**
     * Delete contactRelation by user's and friend's emails
     * @param user email of user
     * @param friend email of friend
     */
    public void deleteContact(String user, String friend) {
        Optional<Contact> contact = contactRepository.findByUserAndFriend(user, friend);
        contact.ifPresent(c -> contactRepository.deleteById(c.getId()));
    }
}
