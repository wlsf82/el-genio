export function RecentExecutionsListItem() {
  return (
    <div className="bg-white rounded-sm border p-4 flex items-start gap-3">
      <div className="flex-1">
        <div className="font-medium text-sm">Test</div>
        <div className="flex gap-2 mt-1">
          <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
            x suites
          </span>
          <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
            xx test cases
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">1d ago</span>
      </div>
    </div>
  );
}
