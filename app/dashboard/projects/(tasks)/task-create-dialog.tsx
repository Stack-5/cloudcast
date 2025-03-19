"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useOrganization } from "@/context/organization-context";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import { createTask } from "@/app/dashboard/projects/actions";
import { TaskCreateDialogProps } from "./task-type";

const TASK_LABELS = ["Feature", "Bug", "Improvement"] as const;
const TASK_PRIORITIES = ["High", "Medium", "Low"] as const;

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
    isDialogOpen,
    setIsDialogOpen,
    fetchTasksData,
    users,
    projectId,
}) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskLabel, setTaskLabel] = useState<"Feature" | "Bug" | "Improvement">("Feature");
    const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
    const [assignee, setAssignee] = useState("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // ✅ State for AlertDialog

    const { selectedOrg } = useOrganization();
    const { user } = useUser();

    const hasUnsavedChanges = taskTitle || assignee; // ✅ Detect changes

    const handleCreateTask = async () => {
        if (!selectedOrg) return toast.error("No organization selected!");
        if (!user || !user.id) return toast.error("User not found!");
        if (!assignee) return toast.error("Please select an assignee!");
        if (!projectId) return toast.error("No project selected!");

        try {
            await createTask({
                title: taskTitle,
                label: taskLabel,
                priority: taskPriority,
                status: "Todo", // ✅ Add default status
                assignee_id: assignee,
                organization_id: selectedOrg.id,
                project_id: projectId,
                created_by: user.id,
            });

            fetchTasksData();
            handleCloseDialog(); // ✅ Reset state when task is created
            toast.success("Task created successfully!");
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Failed to create task.");
        }
    };


    const handleCloseDialog = () => {
        setTaskTitle("");
        setTaskLabel("Feature");
        setTaskPriority("Medium");
        setAssignee("");
        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (open) {
                        setIsDialogOpen(true);
                    } else if (hasUnsavedChanges) {
                        setShowConfirmDialog(true); // ✅ Show confirmation dialog before closing
                    } else {
                        handleCloseDialog();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="label" className="text-right">Label</Label>
                            <Select value={taskLabel} onValueChange={(value) => setTaskLabel(value as typeof TASK_LABELS[number])}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select label" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TASK_LABELS.map((label) => (
                                        <SelectItem key={label} value={label}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">Priority</Label>
                            <Select value={taskPriority} onValueChange={(value) => setTaskPriority(value as typeof TASK_PRIORITIES[number])}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TASK_PRIORITIES.map((priority) => (
                                        <SelectItem key={priority} value={priority}>
                                            {priority}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assignee" className="text-right">Assignee</Label>
                            <Select value={assignee} onValueChange={setAssignee}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTask} disabled={!taskTitle.trim() || !assignee}>Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ AlertDialog for unsaved changes */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Are you sure you want to close the task creation dialog?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowConfirmDialog(false);
                            handleCloseDialog();
                        }}>
                            Discard Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TaskCreateDialog;
