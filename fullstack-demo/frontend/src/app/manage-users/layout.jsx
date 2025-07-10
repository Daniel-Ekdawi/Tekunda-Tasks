import AuthGuard from "@/components/layout/AuthGuard";

export default function UsersLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}