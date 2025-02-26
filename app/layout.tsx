import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";


export const metadata: Metadata = {
  title: "CaDa",
  description: "Online stores near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/cada_logo_enhanced.png" />
      </head>
      <body
        className="min-h-screen bg-gray-100"
      >
        <div className="flex flex-col items-center py-1 border-r-stone-950 border-black bg-blue-500">
      <Image src="/cada_logo_enhanced.png" alt="CaDa Logo" width={100} height={100} />
    </div>
        {children}
      </body>
    </html>
  );
}
