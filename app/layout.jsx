import "./globals.css";
import {Roboto} from "next/font/google";
import {AppProvider} from "../lib/store";
import {Shell} from "@/components/Chrome";

const f=Roboto({subsets:["latin"],weight:["300","400","500","700","900"]});

export const metadata={title:"NEO Studios",description:"A self-portrait studio in Malabon City, Philippines."};

export default function RootLayout({children}){
  return (
    <html lang="en">
      <body className={f.className} suppressHydrationWarning>
        <AppProvider><Shell>{children}</Shell></AppProvider>
      </body>
    </html>
  );
}