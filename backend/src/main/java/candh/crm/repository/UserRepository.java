package candh.crm.repository;

import candh.crm.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String>
{
    User findByEmail(String email);

//    @Query()
//    List<User> searchByKeywords(String email, String first_name, String last_name,
//                              String areaOrRegion, String industry);
}
