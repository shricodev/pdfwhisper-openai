export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 min-h-screen place-items-center">
      <div className="container">{children}</div>
    </div>
  );
}
