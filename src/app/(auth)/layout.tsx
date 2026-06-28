export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080f] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(168,85,247,0.2),transparent_60%)] p-4">
      {children}
    </div>
  );
}
