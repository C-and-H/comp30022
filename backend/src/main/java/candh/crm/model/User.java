package candh.crm.model;

import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.util.Pair;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@ToString

@Document(collection = "user")
public class User implements UserDetails
{
    @Id
    private String id;
    @Indexed(unique = true)
    private String email;
    private String password;
    private String first_name;
    private String last_name;
    /** empty list by default, consist of (mobileCountryCode, mobileNumber) */
    private List<Pair<String,String>> mobiles;
    /** false by default, visiting the confirmation link will set this to true */
    private boolean enabled;
    /** random path of random length for the confirmation link */
    private String signupConfirmPath;

    // for random string generator
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
    private static SecureRandom random = new SecureRandom();   // alphanumeric string of length 20-30

    public User(String email, String password, String first_name, String last_name) {
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.mobiles = new ArrayList<>();
        this.enabled = false;
        this.signupConfirmPath = generateRandomString(random.nextInt(11)+20);
    }

    @Override
    public String getPassword() {
        return password;
    }

    private static String generateRandomString(int length) {
        if (length < 1) throw new IllegalArgumentException();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int rndCharAt = random.nextInt(DATA_FOR_RANDOM_STRING.length());
            sb.append(DATA_FOR_RANDOM_STRING.charAt(rndCharAt));
        }
        return sb.toString();
    }

    /**
     * Get a user's full name.
     */
    public String getName() {
        return this.first_name + " " + this.last_name;
    }

    public void addMobile(String mobileCountryCode, String mobileNumber) {
        mobiles.add(Pair.of(mobileCountryCode, mobileNumber));
    }

    public boolean hasMobile(String mobileCountryCode, String mobileNumber) {
        return mobiles.contains(Pair.of(mobileCountryCode, mobileNumber));
    }

    public void deleteMobile(String mobileCountryCode, String mobileNumber) {
        mobiles.remove(Pair.of(mobileCountryCode, mobileNumber));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> listAuthorities = new ArrayList<GrantedAuthority>() {{
            add(new SimpleGrantedAuthority("ROLE_USER"));
        }};
        return listAuthorities;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public List<Pair<String,String>> getMobiles() {
        return mobiles;
    }

    public String getSignupConfirmPath() {
        return signupConfirmPath;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
