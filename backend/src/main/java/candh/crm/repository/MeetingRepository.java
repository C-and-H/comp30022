package candh.crm.repository;

import candh.crm.model.Meeting;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRepository extends MongoRepository<Meeting, String>
{
    Optional<Meeting> findById(String Id);

    List<Meeting> findByHostId(String hostId);

    @Query(value = "{'participantIds': ['?0']}")
    List<Meeting> findBy_participantId(String participantId);

}
