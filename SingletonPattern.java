// File contents:
// 1- Application class that allows only one app to run at an instant.
// 2- Main class to demonstrate the singleton pattern

class Application {
    private static Application appInstance;
    private String appName;

    private Application(String appName) {
        this.appName = appName;
    }

    public static Application getInstance(String appName) {
        if (appInstance == null) {
            System.out.println("Opening application: " + appName + "...");
            appInstance = new Application(appName);
        } else {
            System.out.println("Cannot open " + appName + "... \n" + 
            "Another application (" + appInstance.appName + ") is already running!\n" +
            "Please close the current application first!");
        }
        return appInstance;
    }

    public void closeApplication() {
        System.out.println("Closing Application: " + appInstance.appName + "...");
        appInstance = null;
    }
}

public class SingletonPattern {
    public static void main(String[] args) {
        System.out.println("\n\nThis is the SingletonPattern file!\n");

        Application app = Application.getInstance("Clash of Clans");
        app = Application.getInstance("Clash Royale");        
        app.closeApplication();        
        app = Application.getInstance("Clash Royale");        

        System.out.println("\n\nThis is the end of the SingletonPattern file!\n");
    }
}