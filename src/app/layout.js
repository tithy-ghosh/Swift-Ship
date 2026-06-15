import {  Mozilla_Headline, Urbanist } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import AosInit from "@/app/components/AosInit";

const urbanist = Urbanist({
  subsets: ["latin"]
})


export const mozilaHeadline = Mozilla_Headline({
  subsets: ["latin"]
})
export const metadata = {
  title: "SwiftShip",
  description: "Speed you can trust",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${urbanist.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        <AosInit />
        {children}
      </body>
    </html>
  );
}
