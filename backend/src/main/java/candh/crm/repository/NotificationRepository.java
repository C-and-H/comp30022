package candh.crm.repository;

import candh.crm.model.Notification;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String>
{
    List<Notification> findByUserId(String userId);

    @Aggregation(pipeline = {
            "{ $match : {'userId': '?0'} }",
            "{ $count : 'count' }"})
    Long countByUserId(String userId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'userId': '?0'}, {'message': ?1}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : 1 }"})
    Notification findMostRecentByUserIdAndMessage(String useId, String message);
}
