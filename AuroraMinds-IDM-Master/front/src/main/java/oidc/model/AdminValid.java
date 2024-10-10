package oidc.model;

public class AdminValid {

    private  String username;

    private  String password;

    public String getName() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setName(String name){
        this.username = name;
    }

    public void setPassword(String password){
        this.password = password;
    }
}
