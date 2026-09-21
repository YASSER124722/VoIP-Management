import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />

        <div className="layout-content">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
