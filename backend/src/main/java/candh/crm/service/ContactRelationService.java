package candh.crm.service;

import candh.crm.exceptions.FriendNotExistException;
import candh.crm.model.Contact;
import candh.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        Contact user_delete = contactRepository
                .findByUserIdAndFriendId(userId, friendId);
        Contact friend_delete = contactRepository
                .findByUserIdAndFriendId(friendId, userId);
        // verify friendship
        if (user_delete != null && friend_delete != null &&
                user_delete.isAccepted() && friend_delete.isAccepted()) {
            contactRepository.delete(user_delete);
            contactRepository.delete(friend_delete);
        } else {
            throw new FriendNotExistException();
        }
    }
}
