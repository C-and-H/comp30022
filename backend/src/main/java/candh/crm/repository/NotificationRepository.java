package candh.crm.repository;

import candh.crm.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String>
{
    List<Notification> findByUserId(String userId);
}
