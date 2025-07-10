import AuthGuard from "@/components/layout/AuthGuard";

export default function ManageRoomsLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}