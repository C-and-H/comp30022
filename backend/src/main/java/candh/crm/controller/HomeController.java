package candh.crm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class HomeController
{
    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok("This is the home page.");
    }
}
