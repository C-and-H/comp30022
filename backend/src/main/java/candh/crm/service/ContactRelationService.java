package candh.crm.service;

import candh.crm.exceptions.FriendNotExistException;
import candh.crm.model.Contact;
import candh.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactRelationService
{
    @Autowired
    private ContactRepository contactRepository;

    /**
     * Find all contacts of a user that the user is accepted by any friend.
     *
     * @param userId  id of the user
     * @return  a list of contact relations that satisfy the conditions.
     */
    public List<Contact> findAllFriends(String userId) {
        List<Contact> friends = contactRepository.findFriendsByUserId(userId);
        friends = friends.stream()
                .filter(c -> contactRepository
                        .findByUserIdAndFriendId(c.getFriendId(), userId)
                        .isAccepted())
                .collect(Collectors.toList());
        return friends;
    }

    /**
     * Delete friend relations by a pair of id's.
     *
     * @param userId  id of the initiator
     * @param friendId  id of the person to be deleted
     */
    public void deleteFriend(String userId, String friendId)
            throws FriendNotExistException {
        Pair<Boolean,?> vrf = verifyFriendship(userId, friendId);
        if (vrf.getFirst()) {
            @SuppressWarnings("unchecked")
            Pair<Contact,Contact> contacts = (Pair<Contact,Contact>) vrf.getSecond();
            contactRepository.delete(contacts.getFirst());
            contactRepository.delete(contacts.getSecond());
        } else {
            throw new FriendNotExistException();
        }
    }

    /**
     * Change notes of a friend for a user.
     *
     * @param userId  id of the initiator
     * @param friendId  id of a friend
     */
    public void changeNotes(String userId, String friendId, String notes)
            throws FriendNotExistException {
        Pair<Boolean,?> vrf = verifyFriendship(userId, friendId);
        if (vrf.getFirst()) {
            @SuppressWarnings("unchecked")
            Pair<Contact,Contact> contacts = (Pair<Contact,Contact>) vrf.getSecond();
            contacts.getFirst().setNotes(notes);
            contactRepository.save(contacts.getFirst());
        } else {
            throw new FriendNotExistException();
        }
    }

    /**
     * Check the friendship between two users.
     *
     * @param user1Id  id of the first user
     * @param user2Id  id of the second user
     * @return  (areFriends=true, (contact_user1, contact_user2)) or (false, false)
     */
    private Pair<Boolean,?> verifyFriendship(
            String user1Id, String user2Id) {
        Contact u = contactRepository.findByUserIdAndFriendId(user1Id, user2Id);
        Contact f = contactRepository.findByUserIdAndFriendId(user2Id, user1Id);
        if (u != null && u.isAccepted() && f != null && f.isAccepted()) {
            return Pair.of(true, Pair.of(u,f));
        } else {
            return Pair.of(false, false);
        }
    }
}
