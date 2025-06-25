// File contents:
// 1- Observer interface
// 2- Subject class
// 3- Person class that implements Observer
// 4- Main class to demonstrate the observer pattern

import java.util.ArrayList;

interface Observer {
    void update(Object message);
}

class Subject {
    private ArrayList<Observer> observers = new ArrayList<>();

    void addObserver(Observer observer) {
        observers.add(observer);
    }

    void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    void notifyObservers(Object message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}

class Person implements Observer {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public void update(Object message) {
        System.out.println(name + " has received the message: " + message.toString());
    }
}

public class ObserverPattern {
    public static void main(String[] args) {
        System.out.println("\n\nThis is the ObserverPattern file!\n");

        Subject chef = new Subject();

        Person person1 = new Person("Peter");
        Person person2 = new Person("Michael");
        Person person3 = new Person("Ahmed");
        Person person4 = new Person("Malak");
        Person person5 = new Person("Fouad");

        chef.addObserver(person1);
        chef.addObserver(person2);
        // chef.addObserver(person3);
        chef.addObserver(person4);
        // chef.addObserver(person5);

        chef.notifyObservers("Dinner is ready!");

        chef.addObserver(person3);
        chef.removeObserver(person1);
        chef.removeObserver(person4);

        System.out.println();

        chef.notifyObservers("Desserts are in 5 minutes!");

        System.out.println("\nThis is the end of the ObserverPattern file.\n");
    }
}