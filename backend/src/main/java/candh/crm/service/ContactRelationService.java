package candh.crm.service;

import candh.crm.model.Contact;
import candh.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ContactRelationService
{
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Find all contacts of a user that the user is accepted by any friend.
     *
     * @param userId  id of the user
     * @return  a list of contact relations that satisfy the conditions.
     */
    public List<Contact> findAllFriends(String userId) {
        List<Contact> _friends = contactRepository.findFriendsByUserId(userId);
        return _friends.parallelStream()
                .filter(c -> contactRepository
                        .findByUserIdAndFriendId(c.getFriendId(), userId)
                        .isAccepted())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Find scenarios 2 and 5.
     *
     * @param userId  id of the user
     * @return  a set of ids
     */
    public Set<String> findAllSentRequests(String userId) {
        List<Contact> _sent = contactRepository.findFriendsByUserId(userId);
        return _sent.parallelStream()
                .filter(c -> !contactRepository
                        .findByUserIdAndFriendId(c.getFriendId(), userId)
                        .isAccepted())
                .map(c -> c.getFriendId())
                .collect(Collectors.toSet());
    }

    /**
     * Find scenario 3.
     *
     * @param userId  id of the user
     * @return  a set of ids
     */
    public Set<String> findAllReceivedRequests(String userId) {
        List<Contact> _received = contactRepository
                .findFriendsByUserIdAsAcceptedAndIgnored(userId, false, false);
        return _received.parallelStream()
                .filter(c -> contactRepository
                        .findByUserIdAndFriendId(c.getFriendId(), userId)
                        .isAccepted())
                .map(c -> c.getFriendId())
                .collect(Collectors.toSet());
    }

    /**
     * Send friend request from a user to another user.
     *
     * @param userId  id of the user
     * @param friendId  id of the friend to send
     */
    public void sendRequest(String userId, String friendId) throws Exception
    {
        Contact u = contactRepository.findByUserIdAndFriendId(userId, friendId);
        Contact f = contactRepository.findByUserIdAndFriendId(friendId, userId);
        if (u == null && f == null) {   // 7, send request
            new Thread(() -> notificationService
                    .createReceiveFriendRequestNotification(friendId, userId))
                    .start();
            contactRepository.save(new Contact(userId, friendId, true));
            contactRepository.save(new Contact(friendId, userId, false));
        }
        else if (u == null || f == null) {
            throw new Exception("Operation refused.");
        }
        else if (u.isAccepted() && !u.isIgnored() && !f.isAccepted()) {
            if (f.isIgnored()) {   // 5, resend declined request
                new Thread(() -> notificationService
                        .createReceiveFriendRequestNotification(friendId, userId))
                        .start();
                f.setIgnored(false);
                contactRepository.save(f);
            }
            // 2, pass
        }
        else if (!u.isAccepted() && f.isAccepted() && !f.isIgnored()) {   // 3 & 4, confirm
            new Thread(() -> notificationService
                    .createAcceptFriendRequestNotification(friendId, userId))
                    .start();
            u.setAccepted(true);
            u.setIgnored(false);
            contactRepository.save(u);
            notificationService
                    .createAcceptFriendRequestNotification(userId, friendId);
        }
        else if (!u.isAccepted() && !u.isIgnored() && !f.isAccepted() &&
                !f.isIgnored()) {   // 6, resend cancelled request
            new Thread(() -> notificationService
                    .createReceiveFriendRequestNotification(friendId, userId))
                    .start();
            u.setAccepted(true);
            contactRepository.save(u);
        }
        else {   // 1 or invalid
            throw new Exception("Operation refused.");
        }
    }

    /**
     * Confirm incoming friend request of a user from another user.
     *
     * Scenario 3 -> 1.
     *
     * @param userId  id of the user
     * @param friendId  id of another user who sent request
     */
    public void confirmRequest(String userId, String friendId) throws Exception
    {
        Contact u = contactRepository.findByUserIdAndFriendId(userId, friendId);
        Contact f = contactRepository.findByUserIdAndFriendId(friendId, userId);
        if (u != null && !u.isAccepted() && !u.isIgnored() &&
                f != null && f.isAccepted() && !f.isIgnored()) {   // 3
            new Thread(() -> notificationService
                    .createAcceptFriendRequestNotification(userId, friendId))
                    .start();
            u.setAccepted(true);
            contactRepository.save(u);
        }
        else {   // other or invalid
            throw new Exception("Operation refused.");
        }
    }

    /**
     * Decline incoming friend request of a user from another user.
     *
     * Scenario 3 -> 4.
     *
     * @param userId  id of the user
     * @param friendId  id of another user who sent request
     */
    public void declineRequest(String userId, String friendId) throws Exception
    {
        Contact u = contactRepository.findByUserIdAndFriendId(userId, friendId);
        Contact f = contactRepository.findByUserIdAndFriendId(friendId, userId);
        if (u != null && !u.isAccepted() && !u.isIgnored()
                && f != null && f.isAccepted() && !f.isIgnored()) {   // 3
            u.setIgnored(true);
            contactRepository.save(u);
        }
        else {   // other or invalid
            throw new Exception("Operation refused.");
        }
    }

    /**
     * Withdraw outgoing friend request of a user to another user.
     *
     * Scenarios 2 or 5 -> 6.
     *
     * @param userId  id of the user
     * @param friendId  id of the friend who the user sent request to
     */
    public void cancelRequest(String userId, String friendId) throws Exception
    {
        Contact u = contactRepository.findByUserIdAndFriendId(userId, friendId);
        Contact f = contactRepository.findByUserIdAndFriendId(friendId, userId);
        if (u != null && u.isAccepted() && !u.isIgnored() &&
                f != null && !f.isAccepted()) {   // 2 or 5
            u.setAccepted(false);
            f.setIgnored(false);
            contactRepository.save(u);
            contactRepository.save(f);
            if (!f.isIgnored()) {   // delete notification
                notificationService
                        .deleteReceiveFriendRequestNotification(friendId, userId);
            }
        }
        else {   // other or invalid
            throw new Exception("Operation refused.");
        }
    }

    /**
     * Delete friend relations by a pair of id's.
     *
     * @param userId  id of the initiator
     * @param friendId  id of the person to be deleted
     */
    public void deleteFriend(String userId, String friendId) throws Exception {
        Pair<Boolean,?> vrf = verifyFriendship(userId, friendId);
        if (vrf.getFirst()) {
            @SuppressWarnings("unchecked")
            Pair<Contact,Contact> contacts = (Pair<Contact,Contact>) vrf.getSecond();
            contactRepository.delete(contacts.getFirst());
            contactRepository.delete(contacts.getSecond());
        } else {
            throw new Exception("No existing friend is found to have this id.");
        }
    }

    /**
     * Change notes of a friend for a user.
     *
     * @param userId  id of the user
     * @param friendId  id of a friend
     */
    public void changeNotes(String userId, String friendId, String notes) throws Exception {
        Pair<Boolean,?> vrf = verifyFriendship(userId, friendId);
        if (vrf.getFirst()) {
            @SuppressWarnings("unchecked")
            Pair<Contact,Contact> contacts = (Pair<Contact,Contact>) vrf.getSecond();
            contacts.getFirst().setNotes(notes);
            contactRepository.save(contacts.getFirst());
        } else {
            throw new Exception("No existing friend is found to have this id.");
        }
    }

    /**
     * Check the friendship between two users.
     *
     * @param user1Id  id of the first user
     * @param user2Id  id of the second user
     * @return  (areFriends=true, (contact_user1, contact_user2)) or (false, false)
     */
    public Pair<Boolean,?> verifyFriendship(String user1Id, String user2Id) {
        Contact u = contactRepository.findByUserIdAndFriendId(user1Id, user2Id);
        Contact f = contactRepository.findByUserIdAndFriendId(user2Id, user1Id);
        if (u != null && u.isAccepted() && f != null && f.isAccepted()) {
            return Pair.of(true, Pair.of(u,f));
        } else {
            return Pair.of(false, false);
        }
    }
}
