package candh.crm.repository;

import candh.crm.model.Chat;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String>
{
    @Query(value = "{$and: [{'receiverId': '?0'}, {'unread': true}]}")
    List<Chat> findUnreadByReceiverId(String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}," +
                               "{'receiverId': '?1'}," +
                               "{'unread': false}," +
                               "{'when': {$lt: '?3'}}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : '?2' }"})
    List<Chat> findNReadBySenderAndReceiverIdFromT(
            String senderId, String receiverId, int n, Date t);
}
