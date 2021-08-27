package candh.crm.service;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Database CRUD.
 */
@Service
public class UserDataService
{
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUserById(String id) { return userRepository.findById(id); }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            userRepository.deleteById(user.getId());
        }
    }

    public List<User> findUsersAll() {
        return userRepository.findAll();
    }
}
