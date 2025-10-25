import "./globals.css";
import Queryclientprovider from "./queryClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <Queryclientprovider>
          {children}
        </Queryclientprovider>
      </body>
    </html>
  );
}
