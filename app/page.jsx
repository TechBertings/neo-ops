import "./globals.css";

export const metadata = {
  title: "NEO Studios",
  description: "A self-portrait studio in Malabon City, Philippines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}