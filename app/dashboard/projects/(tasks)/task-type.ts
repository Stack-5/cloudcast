import { Table as TanstackTable, ColumnDef } from "@tanstack/react-table"; // ✅ Ensure imports

export type TaskCreateDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  fetchTasksData: () => void;
  projectId: string;
  users: {
    id: string;
    name: string;
    avatar: string;
  }[];
};

export type Task = {
  id?: string;
  project_id: string;
  organization_id: string;
  title: string;
  description: string;
  label: "Feature" | "Bug" | "Improvement";
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In Progress" | "Done" | "Backlog" | "Canceled";
  assignee_id: string;
  created_by: string;
  created_at?: string;
};

export type TaskAreaProps = {
  table: TanstackTable<Task>;
  columns: ColumnDef<Task>[];
  onRowDoubleClick: (task: Task) => void;
};

export type TaskFilterProps = {
  table: TanstackTable<Task>;
  columns: ColumnDef<Task>[];
};
