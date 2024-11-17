export const metadata = {
  title: "Night Reader",
  description: "A simple web app for reading in the dark.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
