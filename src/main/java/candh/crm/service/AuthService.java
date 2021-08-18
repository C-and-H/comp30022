package candh.crm.service;

import candh.crm.model.User;
import candh.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthService implements UserDetailsService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void signupUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            List<GrantedAuthority> listAuthorities = new ArrayList<GrantedAuthority>();
            listAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            // use email as username
            return new org.springframework.security.core.userdetails.User(user.getEmail(),
                    user.getPassword(), listAuthorities);
        } else {
            throw new UsernameNotFoundException("email not found");
        }
    }
}
