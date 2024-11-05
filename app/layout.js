import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/authContext";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Broodle",
  description: "Track you daily mood every day of the year",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
            <link rel="icon" href="favicon.png" sizes="any" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </head>
      <AuthProvider>

      <body className={`w-full mx-auto max-w-[1000px] text-sm sm:text-base min-h-screen flex flex-col ${opensans.className} text-slate-800`}>
      <Header />
      {children}
      <Footer />
      </body>
      </AuthProvider>
    </html>
  );
}
