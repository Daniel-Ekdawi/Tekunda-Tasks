import AuthGuard from "@/components/layout/AuthGuard";

export default function BookingLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}