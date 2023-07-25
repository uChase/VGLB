import NavBar from "@/components/NavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Provider from "../components/Provider";
// import NextNProgress from "nextjs-progressbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VGLB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={[inter.className, " bg-slate-800 text-slate-200"]}>
        <Provider>
          {/* <NextNProgress /> */}
          <NavBar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
