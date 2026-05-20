import NavBar from "@/components/shared/NavBar";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { AuthProvider } from "@/providers/auth-provider";
import { getInitialUser } from "@/utils/authUtil";

export const metadata: Metadata = {
  title: {
    template: "Personal Blog - %s",
    default: "Personal Blog",
  },
  description: "Personal Blog Site",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the initial user on the server side before rendering the layout
  // This allows us to provide the user data to the AuthProvider context, which can then be used by the NavBar and other components to conditionally render content based on authentication status
  // Prevents flash of unauthenticated content on page load and keeps the user logged in across refreshes
  const initialUser = await getInitialUser();

  return (
    <html lang="en">
      {/* min-h-screen ensures the body takes up at least the full height of the viewport */}
      <body className="flex flex-col min-h-screen">
        <AuthProvider initialUser={initialUser}>
          <NavBar />
          {/* flex-grow pushes the footer down by taking up all available space */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
