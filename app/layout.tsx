import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import AudioProvider from "@/providers/audioProvider"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generated your podcasts using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AudioProvider>
        <body className={manrope.className}>{children}</body>
      </AudioProvider>
    </html>
  )
}
