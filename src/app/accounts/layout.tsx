import AuthComponent from "@/components/auth/authComponent";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthComponent>{children}</AuthComponent>;
}
