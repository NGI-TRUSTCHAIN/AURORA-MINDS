package oidc.controller;

import eu.olympus.client.interfaces.UserClient;
import eu.olympus.model.Attribute;
import eu.olympus.model.AttributeIdentityProof;
import eu.olympus.model.Operation;
import eu.olympus.model.Policy;
import eu.olympus.model.Predicate;
import eu.olympus.model.exceptions.AuthenticationFailedException;
import eu.olympus.model.exceptions.ExistingUserException;
import eu.olympus.model.exceptions.OperationFailedException;
import eu.olympus.model.exceptions.TokenGenerationException;
import eu.olympus.model.exceptions.UserCreationFailedException;
import eu.olympus.model.server.rest.IdentityProof;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import oidc.model.*;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.eclipse.jetty.util.ajax.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.Cookie;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;

@Controller
public class OidcController {

    private static final Logger logger = LoggerFactory.getLogger(OidcController.class);

    @Autowired
    UserClient userClient;

    @Autowired
    Policy policy;

    @Autowired
    Storage storage;

    // Login
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(Model model, @RequestParam String redirect_uri, @RequestParam String state, @RequestParam String nonce, HttpServletRequest request) {
        request.getSession().setAttribute("redirectUrl", redirect_uri);
        request.getSession().setAttribute("state", state);
        request.getSession().setAttribute("nonce", nonce);
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        policy.setPolicyId(nonce);
        return "/login";
    }

    @RequestMapping(value = "/loginCredentials", method = RequestMethod.GET)
    public String loginCredentials(Model model, HttpServletRequest request, HttpSession session) throws  OperationFailedException {
        return "loginCreds";
    }

    private Cookie getCookie(HttpServletRequest request, String name) {
        // Retrieve a specific cookie by name
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie;
                }
            }
        }
        return null;
    }


    @RequestMapping(value = "/loginFailed", method = RequestMethod.GET)
    public String login(Model model) {
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("loginError", true);
        return "/login";
    }

    @RequestMapping(value = "/loginPage", method = RequestMethod.GET)
    public String loginPage(Model model) {
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasCreated", false);
        return "/login";
    }

    @PostMapping("/authenticate")
    public RedirectView authenticate(LoginRequest loginRequest, Model model, HttpServletRequest request) throws AuthenticationFailedException, TokenGenerationException {
        try {
            policy.getPredicates().add(new Predicate("audience", Operation.REVEAL, new Attribute("olympus-service-provider")));
            System.out.println("Predicates: " + policy.getPredicates());
            String token = userClient.authenticate(loginRequest.getUsername(), loginRequest.getPassword(), policy, null, "NONE");
            model.addAttribute("username", loginRequest.getUsername());
            model.addAttribute("token", token);
            logger.info("Policy predicates: {}", policy.getPredicates());

            String redirectUrl = (String) request.getSession().getAttribute("redirectUrl");
            String state = (String) request.getSession().getAttribute("state");
            return new RedirectView(redirectUrl + "#state=" + state + "&id_token=" + token + "&token_type=bearer");
        } catch (Exception e) {
            if (ExceptionUtils.indexOfThrowable(e, AuthenticationFailedException.class) != -1) {
                return new RedirectView("/loginFailed", true);
            } else {
                throw e;
            }
        } finally {
            userClient.clearSession();
        }
    }


    // Logout

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(Model model, HttpServletRequest request) throws ServletException {
        userClient.clearSession();
        request.getSession().removeAttribute("name");
        request.getSession().removeAttribute("birthdate");
//        request.getSession().removeAttribute("given_name");
        request.getSession().removeAttribute("nickname");
        request.getSession().removeAttribute("middle_name");
        request.getSession().removeAttribute("given_name");
        request.getSession().setAttribute("loggedIn", false);
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasCreated", false);
        return "/login";
    }

    @GetMapping("/admin")
    public String adminPanel(Model model){
        model.addAttribute("adminValid", new AdminValid());
        model.addAttribute("error", false);
        return "administratorValidation";
    }

    @PostMapping("/admin")
    public String adminValid(AdminValid adminValid, Model model){

        if("admin".equals(adminValid.getName()) && "1234".equals(adminValid.getPassword())){
            model.addAttribute("username", adminValid.getName());
            model.addAttribute("password", adminValid.getPassword());
//            return "redirect:/administrator";
            return "redirect:/createUser";
        }else {
            model.addAttribute("error", true);
            return "administratorValidation";
        }
    }

    @GetMapping("/administrator")
    public String admin(){
        return "administrator";
    }

    // Create User
    @RequestMapping(value = "/createUser", method = RequestMethod.GET)
    public String createNewUser(Model model) {
        model.addAttribute("userExists", false);
        model.addAttribute("idExists", false);
        ClinicianUserRequest clinicianUserRequest = new ClinicianUserRequest();
        model.addAttribute("clinicianUserRequest", clinicianUserRequest);
        return "/createUser";
    }

    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
    public String postUser(@Valid @ModelAttribute("clinicianUserRequest") ClinicianUserRequest clinicianUserRequest, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "/createUser";
        }
        try {
            IdentityProof identityProof = constructIdentityProof(clinicianUserRequest);
            userClient.createUserAndAddAttributes(clinicianUserRequest.getUsername(), clinicianUserRequest.getPassword(), identityProof);
        } catch (Exception exception) {
            if (ExceptionUtils.indexOfThrowable(exception, ExistingUserException.class) != -1) {
                System.out.println(ExceptionUtils.indexOfThrowable(exception, ExistingUserException.class));
                model.addAttribute("userExists", true);
                model.addAttribute("idExists", true);
            } else if (ExceptionUtils.indexOfThrowable(exception, AuthenticationFailedException.class) != -1) {
                System.out.println(ExceptionUtils.indexOfThrowable(exception, AuthenticationFailedException.class));
                model.addAttribute("userExists", true);
                model.addAttribute("idExists", true);
            } else if (ExceptionUtils.indexOfThrowable(exception, UserCreationFailedException.class) != -1) {
                System.out.println(ExceptionUtils.indexOfThrowable(exception, UserCreationFailedException.class));
                model.addAttribute("userExists", true);
                model.addAttribute("idExists", true);
            } else {
                model.addAttribute("unknownError", true);
            }
            logger.warn("Create user failed: " + exception);
            return "/createUser";
        }
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasCreated", true);
        userClient.clearSession();
        return "/login";
    }

    private AttributeIdentityProof constructIdentityProof(ClinicianUserRequest clinicianUserRequest) {
        Map<String, Attribute> attributes = new HashMap<>();
        attributes.put("name", new Attribute(clinicianUserRequest.getFirstName() + " " + clinicianUserRequest.getLastName()));
        attributes.put("birthdate", new Attribute(clinicianUserRequest.getBirthdate()));

        attributes.put("given_name", new Attribute(clinicianUserRequest.getGiven_name()));

        attributes.put("nickname", new Attribute(clinicianUserRequest.getNickname()));

        attributes.put("middle_name", new Attribute(clinicianUserRequest.getMiddle_name()));

//        attributes.put("given_name", new Attribute(clinicianUserRequest.getGiven_name()));

        return new AttributeIdentityProof(attributes);
    }

    @GetMapping("/form")
    public String displayData(Model model, HttpSession session) {
        // Retrieve the applicationForm object from the session
        New_application applicationForm = (New_application) session.getAttribute("applicationForm");
        session.setAttribute("applicationForm", applicationForm);

        if (applicationForm != null) {
            // Set the applicationForm object in the model

            model.addAttribute("applicationForm", applicationForm);
            model.addAttribute("protocolid", applicationForm.getProtocolid());
            model.addAttribute("requestcode", applicationForm.getRequestcode());
            model.addAttribute("address", applicationForm.getAddress());
            model.addAttribute("phonenumber", applicationForm.getPhonenumber());
            model.addAttribute("fax", applicationForm.getFax());
            model.addAttribute("email", applicationForm.getEmail());
            model.addAttribute("information", applicationForm.getInformation());
            model.addAttribute("semester", applicationForm.getSemester());
            model.addAttribute("modeofstydies", applicationForm.getModeofstudies());
//

        } else {
            // Handle the case where applicationForm is not found in the session
            // You can redirect to an error page or take appropriate action
            return "/error"; // Replace with your actual error page URL
        }

        // Return the Thymeleaf template for displaying the data
        return "form"; // This corresponds to the template name without the ".html" extension
    }

    @RequestMapping("/changePassword")
    public String changePassword(Model model) {
        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest();
        model.addAttribute("changePasswordRequest", changePasswordRequest);
        return "/changePassword";
    }


    @PostMapping("/changePassword")
    public String postChangePassword(@Valid ChangePasswordRequest changePasswordRequest, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "/changePassword";
        }
        try {
            userClient.changePassword(changePasswordRequest.getUsername(), changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword(), null, "NONE");
        } catch (Exception exception) {
            if (ExceptionUtils.indexOfThrowable(exception, UserCreationFailedException.class) != -1) {
                model.addAttribute("passwordChangeError", true);
            } else if (ExceptionUtils.indexOfThrowable(exception, AuthenticationFailedException.class) != -1) {
                model.addAttribute("usernameWrongError", true);
            } else {
                model.addAttribute("unknownError", true);
            }
            return "/changePassword";
        }
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasChangedPassword", true);
        userClient.clearSession();
        return "/login";
    }


    @RequestMapping("/deleteAccount")
    public String deleteAccount(Model model) {
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        return "/deleteAccount";
    }


    @PostMapping("/deleteAccount")
    public String postDeleteAccount(LoginRequest loginRequest, Model model) {
        try {
            userClient.deleteAccount(loginRequest.getUsername(), loginRequest.getPassword(), null, "NONE");
        } catch (Exception exception) {
            if (ExceptionUtils.indexOfThrowable(exception, AuthenticationFailedException.class) != -1) {
                model.addAttribute("userDeletionError", true);
            } else {
                model.addAttribute("unknownError", true);
            }
            return "/deleteAccount";
        }
        loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasDeletedAccount", true);
        return "/login";
    }

    private String getFrontpage(Model model) {

        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);

        return "/login";
    }

    @GetMapping("/verify1")
    public String verify(Model model, HttpServletRequest request) {


        model.addAttribute("username", request.getSession().getAttribute("username"));
        model.addAttribute("policy", request.getSession().getAttribute("policy"));


        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        System.out.println(request.getSession().getAttribute("policy"));
        System.out.println();

        return "/verify1";
    }

    @GetMapping("/storage")
    public String hello(Model model, HttpServletRequest request) {
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("hasCreated", false);
        return "/storage";
    }

    @PostMapping("/storage")
    public String showUserInfo(Model model, HttpServletRequest request, LoginRequest loginRequest) throws AuthenticationFailedException, OperationFailedException {
        String token = userClient.authenticate(loginRequest.getUsername(), loginRequest.getPassword(), policy, null, "NONE");
        storage.checkCredential();
        System.out.println(storage.checkCredential());

        model.addAttribute("username", loginRequest.getUsername());
        model.addAttribute("token", token);
        model.addAttribute("firstname", request.getSession().getAttribute("username"));
        model.addAttribute("YearsOfStudies", request.getSession().getAttribute("YearsOfStudies"));
        model.addAttribute("AM", request.getSession().getAttribute("Studentid"));
        model.addAttribute("Address", request.getSession().getAttribute("Address"));
        model.addAttribute("PhoneNumber", request.getSession().getAttribute("PhoneNumber"));
        model.addAttribute("loginRequest", loginRequest);

        return "storage";
    }



    @RequestMapping("manageAccountLogin")
    public String manageAccountLogin(Model model) {
        LoginRequest loginRequest = new LoginRequest();
        model.addAttribute("loginRequest", loginRequest);
        return "/manageAccountLogin";
    }


    @GetMapping("/error")
    public String showErrorPage() {
        return "error"; // This corresponds to the name of your HTML file (without the extension)
    }
}