import "./globals.css";

import Notification from "@/components/layout/Notification";
import Popup from "@/components/layout/Popup";
import { NotificationProvider } from '@/components/context/NotificationContext';
import { PopupProvider } from '@/components/context/PopupContext';
import { SessionProvider } from '@/components/context/SessionContext';
import Navbar from "@/components/layout/Navbar";

export const metadata = {
    title: "BookAway",
    description: "Hotel reservation app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <NotificationProvider>
                    <PopupProvider>
                        <SessionProvider>
                            <Navbar />
                            <Notification />
                            <Popup />
                            {children}
                        </SessionProvider>
                    </PopupProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
