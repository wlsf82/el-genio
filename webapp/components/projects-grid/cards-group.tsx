export function ProjectsGridCard() {
  return (
    <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">coveragegoose-blog</div>
          <div className="text-xs text-gray-500 truncate">blog.downtobid.com</div>
        </div>
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <span className="material-icons">more_horiz</span>
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1">basisboard/coveragegoose</div>
      <div className="text-xs text-gray-400">
        Merge branch 'staging'{' '}
        <span className="ml-1">
          2d ago on <span className="font-mono">main</span>
        </span>
      </div>
    </div>
  )
}
