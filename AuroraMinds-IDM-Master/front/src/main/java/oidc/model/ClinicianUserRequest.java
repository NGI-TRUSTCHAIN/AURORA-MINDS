package oidc.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A container for a login request
 */
@Getter
@Setter
public class ClinicianUserRequest {


    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    private String username;

    @NotNull(message = "Can't be empty")
    @Size(min = 4, message = "Must have more than 4 symbols")
    private String password;

    private String passwordCheck;
    private boolean passwordsEqual;

    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    private String firstName;

    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    private String lastName;

    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String birthdate;

    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    //for user_role because open id protocol
    private String given_name;

    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    //for clinicianID because open id protocol
    private String nickname;

//    @NotNull(message = "Can't be empty")
//    @Size(min=1, message = "Must not be empty")
//    //for user_role because open id protocol
//    private String preferred_username;



    @NotNull(message = "Can't be empty")
    @Size(min=1, message = "Must not be empty")
    //for email because open id protocol
    private String middle_name;

    @AssertTrue(message = "Passwords should match")
    public boolean isPasswordsEqual() {
        if(password != null){
            return password.equals(passwordCheck);
        }
        return false;
    }
}
