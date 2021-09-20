package candh.crm.repository;

import candh.crm.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String>
{
    @Query(value = "{$and: [{'userId': '?0'}, {'friendId': '?1'}]}")
    Contact findByUserIdAndFriendId(String userId, String FriendId);

    @Query(value = "{$and: [{'userId': '?0'}, {'accepted': true}]}")
    List<Contact> findFriendsByUserId(String userId);

    @Query(value = "{$and: [{'userId': '?0'}, {'accepted': ?1}, {'ignored': ?2}]}")
    List<Contact> findFriendsByUserIdAsAcceptedAndIgnored(
            String userId, boolean accepted, boolean ignored);
}
