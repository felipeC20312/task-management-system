import { Card } from "@/shared/components/shadcnui/card";
import { TaskListTable } from "./components/taskListTable";
import { Input } from "@/shared/components/shadcnui/input";
import { Button } from "@/shared/components/shadcnui/button";

export const TaskListPage = () => {
  const mock = [
    {
      id: "1",
      status: "Pending",
      title: "Design landing page",
      date: "2025-12-02",
      priority: "High",
      description:
        "Create the initial design for the landing page, including mobile and desktop versions.",
      assignee: "Alice",
    },
    {
      id: "2",
      status: "In Progress",
      title: "Setup CI/CD",
      date: "2025-12-03",
      priority: "Medium",
      description:
        "Configure GitHub Actions to automate build, test, and deployment workflows.",
      assignee: "Bob",
    },
    {
      id: "3",
      status: "Completed",
      title: "User authentication module",
      date: "2025-12-01",
      priority: "High",
      description:
        "Implement JWT authentication with refresh tokens, login, and registration endpoints.",
      assignee: "Carol",
    },
    {
      id: "4",
      status: "Pending",
      title: "Write unit tests",
      date: "2025-12-05",
      priority: "Low",
      description: "Cover the main services and controllers with Jest tests.",
      assignee: "Dave",
    },
    {
      id: "5",
      status: "In Progress",
      title: "Create notification service",
      date: "2025-12-04",
      priority: "Medium",
      description:
        "Implement a microservice that handles email and in-app notifications.",
      assignee: "Eve",
    },
  ];

  return (
    <main className="flex-col bg-linear-to-tr from-background-dark to-background w-full h-dvh flex items-center justify-center">
      <div className="flex flex-col gap-8 w-full md:w-[90%]">
        <div className="flex flex-col gap-8">
          <h2>Task List</h2>
          <div className="flex">
            <div className="flex flex-1 gap-8">
              <Input></Input>
              <Input></Input>
            </div>
            <div className="flex gap-8">
              <Button>+ New task</Button>
              <Button>Notifications</Button>
            </div>
          </div>
        </div>
        <Card className="w-full p-8">
          <h3>Today</h3>
          <TaskListTable items={mock} />
          <h3>Up Comming</h3>
          <TaskListTable items={mock} />
        </Card>
      </div>
    </main>
  );
};
