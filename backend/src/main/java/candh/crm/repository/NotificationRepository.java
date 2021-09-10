package candh.crm.repository;

import candh.crm.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String>
{
    List<Notification> findByUserId(String userId);

    @Query(value = "{$and: [{'userId': '?0'}, {'message': ?1}]}")
    Notification findByUserIdAndMessage(String userId, String message);
}
