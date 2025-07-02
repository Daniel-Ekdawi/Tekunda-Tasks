import AuthGuard from "@/components/layout/AuthGuard";

export default function ManageHotelsLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}