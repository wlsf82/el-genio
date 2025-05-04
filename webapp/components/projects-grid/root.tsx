export function ProjectsGridRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 grid grid-cols-2 auto-rows-auto gap-4 items-start">
      {children}
    </div>
  );
}
