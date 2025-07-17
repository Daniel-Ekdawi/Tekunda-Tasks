import AuthGuard from "@/components/layout/AuthGuard";

export default function ReservationLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}