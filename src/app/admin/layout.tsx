import { getLovanarisSession } from "@/lib/actions/lovanaris-auth";
import { redirect } from "next/navigation";

export default async function LovanarisAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getLovanarisSession();

  // Wenn keine Lovanaris-Session existiert -> Redirect zum Lovanaris-Login
  if (!session) {
    redirect("/lovanaris/login?callbackUrl=/lovanaris/admin");
  }

  return (
    <div className="lovanaris-admin-wrapper" style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
