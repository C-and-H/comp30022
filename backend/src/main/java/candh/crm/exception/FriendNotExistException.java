package candh.crm.exception;

/**
 * An exception thrown when a user is attempting to
 * manipulate contact relation with another user who is found not existing
 * or not the user's friend.
 */
public class FriendNotExistException extends Exception
{
    public FriendNotExistException() {
        super("No existing friend is found to have this id.");
    }
}
