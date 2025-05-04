interface AppSidebarMenuItemProps {
  label: string;
  active?: boolean;
}

export function AppSidebarMenuItem({ label, active }: AppSidebarMenuItemProps) {
  return (
    <div
      className={`px-4 py-2 flex ${
        active ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
}
