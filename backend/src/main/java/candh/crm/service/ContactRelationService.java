package candh.crm.service;

import candh.crm.model.Contact;
import candh.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactRelationService
{
    @Autowired
    private ContactRepository contactRepository;

    /**
     * Save contact to database
     * @param contact the contact to save
     * @return the saved contact; will never be null
     */
    public Contact saveContact(Contact contact){
        return contactRepository.save(contact);
    }

    /**
     * Find the contact list
     * @param user the email of user
     * @return all Contacts of the user
     */
    public List<Contact> findAllFriends(String user) {
        return contactRepository.findByUserEmail(user);
    }

    /**
     * find contactRelation by user's and friend's emails
     * @param user  email of user
     * @param friend  email of friend
     * @return contact found or null if not found
     */
    public Contact findByUserAndFriend(String user, String friend) {
        List<Contact> contacts = contactRepository.findByUserEmail(user);
        if (!contacts.isEmpty()) {
            for (int i = 0; i < contacts.size(); i++) {
                if (contacts.get(i).getFriendEmail().equals(friend)) {
                    return contacts.get(i);
                }
            }
        }
        return null;
    }

    /**
     * Delete contactRelation by user's and friend's emails
     * @param user  email of user
     * @param friend  email of friend
     */
    public void deleteContact(String user, String friend) {
        Contact contact = this.findByUserAndFriend(user, friend);
        if (contact != null) {
            contactRepository.deleteById(contact.getId());
        }
    }
}
