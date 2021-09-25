package candh.crm.repository;

import candh.crm.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>
{
    Optional<User> findById(String Id);

    User findByEmail(String email);

    @Query(value = "{'email': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_Email(String _email);

    @Query(value = "{'first_name': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_First_name(String _first_name);

    @Query(value = "{'last_name': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_Last_name(String _last_name);

    @Query(value = "{'areaOrRegion': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_AreaOrRegion(String _areaOrRegion);

    @Query(value = "{'industry': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_Industry(String _industry);

    @Query(value = "{'company': {$regex: '?0', $options: 'i'}}")
    List<User> findBy_Company(String _company);
}
