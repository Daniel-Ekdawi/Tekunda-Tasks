import "./globals.css";

import Notification from "@/components/layout/Notification";
import { NotificationProvider } from '@/components/context/NotificationContext';
import { SessionProvider } from '../components/context/SessionContext';
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
                    <SessionProvider>
                        <Navbar />
                        <Notification />
                        {children}
                    </SessionProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
