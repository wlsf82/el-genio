import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader.Root>
        <AppHeader.Logo />
        <div className="flex-1" />
        <AppHeader.ProfileMenu />
      </AppHeader.Root>

      <div className="flex flex-1 gap-6 p-4 overflow-auto">
        <div className="w-1/3 min-w-[320px] max-w-sm flex flex-col gap-4">
          <span className="text-sm font-semibold mb-2">Recent runnings</span>

          <div className="flex flex-col gap-2">
            <div className="bg-white rounded-lg shadow border p-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium text-sm">Project name</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
                    3 suites
                  </span>
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
                    18 test cases
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Projects */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-w-0 items-start justify-start bg-red-300">
          <span className="col-span-2 text-sm font-semibold mb-2">
            Projects
          </span>
          <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">coveragegoose-blog</div>
                <div className="text-xs text-gray-500 truncate">
                  blog.downtobid.com
                </div>
              </div>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <span className="material-icons">more_horiz</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              basisboard/coveragegoose
            </div>
            <div className="text-xs text-gray-400">
              Merge branch 'staging'{" "}
              <span className="ml-1">
                2d ago on <span className="font-mono">main</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
