package oidc.model;

public class Book {

    private String[] semester1books = {"programming1", "logikhSxediash", "linearAlgebra", "mathAnalitics"};

    private String[] semester2books = {"oop", "database1", "operatingsystem", "shmataSysthmata"};

    private String[] semester3books = {"texnologiaLogismikoy", "Cybersecurity", "algorithmsandComplexity", "thlepikoinvniakaSysthmata"};

    private String[] semester4books = {"texnologiesefarmogvnDiadiktyiou", "database2", "grafikaYpologiston", "parallhlowprogram"};

    public String[] getSemester1books() {
        return semester1books;
    }

    public void setSemester1books(String[] semester1books) {
        this.semester1books = semester1books;
    }

    public String[] getSemester2books() {
        return semester2books;
    }

    public void setSemester2books(String[] semester2books) {
        this.semester2books = semester2books;
    }

    public String[] getSemester3books() {
        return semester3books;
    }

    public void setSemester3books(String[] semester3books) {
        this.semester3books = semester3books;
    }

    public String[] getSemester4books() {
        return semester4books;
    }

    public void setSemester4books(String[] semester4books) {
        this.semester4books = semester4books;
    }
}
