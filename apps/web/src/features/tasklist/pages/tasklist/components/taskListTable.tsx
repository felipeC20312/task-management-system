import { useState, type FC } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/shadcnui/table";
import { Button } from "@/shared/components/shadcnui/button";
import * as Accordion from "@radix-ui/react-accordion";

interface TaskListTableProps {
  items: Array<{
    id: string;
    status: string;
    title: string;
    date: string;
    priority: string;
    description?: string;
    assignee?: string;
    [key: string]: any;
  }>;
}

export const TaskListTable: FC<TaskListTableProps> = ({ items }) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const hdlEditTask = (taskId: string) => console.log("Edit", taskId);
  const hdlViewTask = (taskId: string) =>
    setExpandedTask(expandedTask === taskId ? null : taskId);
  const hdlDeleteTask = (taskId: string) => console.log("Delete", taskId);

  return (
    <Accordion.Root type="single" collapsible className="flex w-full">
      <Table className="w-full border border-border rounded-2xl">
        <TableBody className="w-full">
          {items.map((item) => (
            <div key={item.id} className="w-full">
              <TableRow className="w-full">
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant={"outline"}
                      onClick={() => hdlEditTask(item.id)}
                    >
                      edit
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => hdlViewTask(item.id)}
                    >
                      view
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => hdlDeleteTask(item.id)}
                    >
                      delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {expandedTask === item.id && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="p-4 bg-gray-50 rounded">
                      <p>
                        <strong>Description:</strong>{" "}
                        {item.description || "N/A"}
                      </p>
                      <p>
                        <strong>Assignee:</strong>{" "}
                        {item.assignee || "Unassigned"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </div>
          ))}
        </TableBody>
      </Table>
    </Accordion.Root>
  );
};
