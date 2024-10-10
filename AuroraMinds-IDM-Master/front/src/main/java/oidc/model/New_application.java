package oidc.model;

import org.apache.tomcat.jni.Address;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class New_application {

    private String firstname;

    private String lastname;

    @Size(min=1, message = "Must not be empty")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String date;

    private String protocolid;

    private String requestcode;

    private String address;

    private String phonenumber;

    private String fax;

    private String email;

    private String information;

    private String semester;
    private String modeofstudies;

    public String getFirstname(){
        return firstname;
    }

    public void setFirstname(String firstname){
        this.firstname = firstname;
    }

    public String getLastname(){
        return lastname;
    }

    public void setLastname(String lastname){
        this.lastname = lastname;
    }

    public String getDate(){
        return date;
    }

    public void setDate(String date){
        this.date = date;
    }

    public String getProtocolid(){
        return protocolid;
    }

    public void setProtocolid(String protocolid){
        this.protocolid = protocolid;
    }

    public String getRequestcode(){
        return requestcode;
    }

    public void setRequestcode(String requestcode){
        this.requestcode = requestcode;
    }

    public String getAddress(){
        return address;
    }

    public void setAddress(String address){
        this.address = address;
    }

    public String getPhonenumber(){
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber){
        this.phonenumber = phonenumber;
    }

    public String getFax(){
        return fax;
    }

    public void setFax(String fax){
        this.fax = fax;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getInformation(){
        return information;
    }

    public void setInformation(String information){
        this.information = information;
    }

    public String getSemester(){
        return semester;
    }

    public void setSemester(String semester){
        this.semester = semester;
    }

    public String getModeofstudies(){
        return modeofstudies;
    }

    public void setModeofstudies(String modeofstudies){
        this.modeofstudies = modeofstudies;
    }

}