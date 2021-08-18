package candh.crm.controller;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController
{
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addUser")
    public String saveUser(@RequestBody User user) {
        userRepository.save(user);
        return "Add user with name " + user.getName();
    }

    @GetMapping("/findAllUsers")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // find all the user
    @GetMapping("/findAllUsers/{id}")
    public User getOneUser(@PathVariable String id) {
        return userRepository.findById(id).orElseGet(User::new);
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user != null) {
            return user.get().getName();
        }
        userRepository.deleteById(id);
        return "uer is deleted with name " + id;
    }
}
