package candh.crm.repository;

import candh.crm.model.Chat;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String>
{
    @Aggregation(pipeline = {
            "{ $match : {$and: [{'receiverId': '?0'}, {'unread': true}]} }",
            "{ $addFields : {'senderId': {$toObjectId: '$senderId'}} }",
            "{ $lookup : {'from': 'user'," +
                         "'localField': 'senderId'," +
                         "'foreignField': '_id'," +
                         "'as': 'senderInfo'} }",
            "{ $replaceRoot : {'newRoot':" +
                    "{$mergeObjects: [{$arrayElemAt: ['$senderInfo', 0]}," +
                                     "'$$ROOT']}} }",
            "{ $project : {'_id': 0, 'first_name': 1} }"
    })
    Set<String> findSendersOfUnread(String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}," +
                               "{'receiverId': ?1}," +
                               "{'unread': true}]} }",
            "{ $count : 'count' }"
    })
    Long countUnread(String senderId, String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [" +
                    "{$or: [{$and: [{'senderId': '?0'}, {'receiverId': '?1'}]}," +
                           "{$and: [{'senderId': '?1'}, {'receiverId': '?0'}]}]}," +
                    "{'when': {$lt: ?2}}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : ?3 }"
    })
    List<Chat> findNUntilT(String userId, String friendId, Date t, int n);

    @Query(value = "{$and: [{'senderId': '?0'}, {'receiverId': ?1}, {'unread': true}]}")
    List<Chat> findUnread(String senderId, String receiverId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [{'senderId': '?0'}, {'receiverId': ?1}]} }",
            "{ $sort : {'when': -1} }",
            "{ $limit : 1 }"
    })
    Chat findLatest(String senderId, String receiverId);
}
