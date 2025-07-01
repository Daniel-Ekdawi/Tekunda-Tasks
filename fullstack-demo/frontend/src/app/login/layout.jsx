import UnAuthGuard from "@/components/layout/UnAuthGuard";

export default function LoginLayout({ children }) {
    return <UnAuthGuard>{children}</UnAuthGuard>;
}