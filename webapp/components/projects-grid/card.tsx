export function ProjectsGridCard({ project }: { project: any }) {
  return (
    <div className="bg-white rounded-lg border p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{project.name}</div>
          <div className="text-xs text-gray-500 truncate">{project.description}</div>
        </div>
      </div>
      <div className="text-xs text-gray-400">{`Last updated ${project.updatedAt}`}</div>
    </div>
  )
}
