package candh.crm.repository;

import candh.crm.model.Chat;
import candh.crm.model.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String>
{
    @Aggregation(pipeline = {
            "{ $match : {$and: [{'receiverId': '?0'}, {'unread': true}]} }",
            "{ $project : {'_id': 0, 'senderId': '$_id'} }",
            "{ $merge : {'into': 'user', 'whenMatched': 'replace'} }"
    })
    List<User> findSendersOfUnread(String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$or: [{'senderId': '?0'}, {'receiverId': '?0'}]} }",
            "{ $cond : {'if': {'senderId': '?0'}," +
                       "'then': {$project: {'receiverId': '$friendId'}}," +
                       "'else': {$project: {'senderId': '$friendId'}}} }",
            "{ $sort : {'friendId': 1, 'when': -1} }",
            "{ $group : {'_id': '$friendId', 'id': {$first: '$_id'}} }",
            "{ $project : {'_id': 0, 'id': '$_id'} }",
            "{ $merge : {'into': 'chatHistory', 'whenMatched': 'replace'} }"
    })
    List<Chat> findEachLatestById(String id);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}," +
                               "{'receiverId': ?1}," +
                               "{'unread': true}]} }",
            "{ $count : 'count' }"
    })
    Long countUnread(String senderId, String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}," +
                               "{'receiverId': '?1'}," +
                               "{'when': {$lt: '?2'}}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : '?3' }"
    })
    List<Chat> findNUntilT(String senderId, String receiverId, Date t, int n);

    @Query(value = "{$and: [{'senderId': '?0'}, {'receiverId': ?1}, {'unread': true}]}")
    List<Chat> findUnread(String senderId, String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}, {'receiverId': ?1}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : 1 }"
    })
    Chat findLatest(String senderId, String receiverId);
}
