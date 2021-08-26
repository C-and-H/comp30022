package candh.crm.repository;

import candh.crm.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String>
{
    List<Contact> findByUserEmail(String userEmail);

    List<Contact> findByFriendEmail(String friendEmail);
}
