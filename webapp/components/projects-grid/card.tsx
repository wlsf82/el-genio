import { EllipsisIcon } from "lucide-react";

export function ProjectsGridCard() {
  return (
    <div className="bg-white rounded-lg border p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">project-name</div>
          <div className="text-xs text-gray-500 truncate">mydomain.com</div>
        </div>
        {/* <button className="ml-2 text-gray-400 hover:text-gray-600">
          <EllipsisIcon className="w-4 h-4" />
        </button> */}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        33 test cases, 100% coverage
      </div>
      <div className="text-xs text-gray-400">Last executed 2d ago</div>
    </div>
  );
}
