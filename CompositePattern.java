// File contents:
// 1- Composite interface
// 2- Subject class
// 3- Person class that implements Observer
// 4- Main class to demonstrate the observer pattern

interface Human {
    void dailyRoutine();
}

class Student implements Human {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    public void dailyRoutine() {
        String routine = "This is " + name + "'s daily routine:\n\n" +
        "1- Wakes up\n" +
        "2- Goes to school\n" + 
        "3- Gets back home\n" +
        "4- Does their homework\n\n";

        System.out.println(routine);
    }
}

class Employee implements Human {
    private String name;

    public Employee(String name) {
        this.name = name;
    }

    public void dailyRoutine() {
        String routine = "This is " + name + "'s daily routine:\n\n" +
        "1- Wakes up\n" +
        "2- Goes to work\n" + 
        "3- Gets back home\n" +
        "4- Hangs out with friends\n\n";

        System.out.println(routine);
    }
}

public class CompositePattern {
    public static void main(String[] args) {
        System.out.println("\n\nThis is the CompositePattern file!\n");

        Student student1 = new Student("Danny");
        Student student2 = new Student("Ziad");
        Employee employee1 = new Employee("Mike");

        student1.dailyRoutine();
        employee1.dailyRoutine();
        student2.dailyRoutine();

        System.out.println("\nThis is the end of the CompositePattern file.\n");
    }
}