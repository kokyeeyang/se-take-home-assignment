import "./globals.css";
export const metadata = {
  title: "McD Order Bots",
  description: "VIP-aware queue with cooking bots"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
