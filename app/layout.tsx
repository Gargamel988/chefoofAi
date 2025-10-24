import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">      
      <body>
          {children}
      </body>
    </html>
  );
}
