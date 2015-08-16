package easyupload;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoDropzoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoDropzoneApplication.class, args);
    }
}
