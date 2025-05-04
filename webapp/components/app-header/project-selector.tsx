import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelector() {
  return (
    <Select>
      <SelectTrigger className="text-xs uppercase h-auto border-none shadow-none focus-visible:ring-0 px-0">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent alignOffset={-12} position="popper">
        <SelectGroup>
          <SelectItem className="uppercase" value="tat">
            Talking about testing
          </SelectItem>
          <SelectItem className="uppercase" value="my_project">
            My project
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
