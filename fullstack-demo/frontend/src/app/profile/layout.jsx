import AuthGuard from "@/components/layout/AuthGuard";

export default function ProfileLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}