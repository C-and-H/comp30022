package candh.crm.repository;

import candh.crm.model.Meeting;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MeetingRepository extends MongoRepository<Meeting, String>
{
    List<Meeting> findByHostId(String hostId);

    @Query(value = "{'participantIds': '?0'}")
    List<Meeting> findBy_participantId(String participantId);

    @Aggregation(pipeline = {
            "{ $match : {$and: [" +
                    "{$or: [{'hostId': '?0'}," +
                           "{'participantIds': '?0'}]}," +
                    "{$or: [{$and: [{'startTime': {$gt: ?1}}, {'startTime': {$lt: ?2}}]}," +
                           "{$and: [{'endTime': {$gt: ?1}}, {'endTime': {$lt: ?2}}]} ]}]} }",
            "{ $sort : {'startTime': -1} }"
    })
    List<Meeting> findRecent(String id, Date start, Date end);
}
