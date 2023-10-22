export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 place-items-center">
      <div className="container">{children}</div>
    </div>
  );
}
