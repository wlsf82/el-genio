import { AppHeader } from "@/components/app-header";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-accent">
      <AppHeader.Root>
        <AppHeader.Logo />
        <div className="flex-1" />
        <AppHeader.ProfileMenu />
      </AppHeader.Root>

      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
