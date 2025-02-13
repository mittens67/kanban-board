import { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: number;
  task: string;
  status: "to_do" | "in_progress" | "done";
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: string, status?: Task["status"]) => void;
  updateTask: (id: number, newStatus: Task["status"]) => void;
  removeTask: (id: number) => void;
  reorderTasks: (updatedColumnTasks: Task[], status: Task["status"]) => void;
}

interface Props {
  children: ReactNode;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, task: "Buy groceries", status: "to_do" },
    { id: 2, task: "Finish React project", status: "in_progress" },
    { id: 3, task: "Workout for 30 minutes", status: "to_do" },
    { id: 4, task: "Reply to client emails", status: "done" },
    { id: 5, task: "Read 10 pages of a book", status: "to_do" },
    { id: 6, task: "Clean the kitchen", status: "done" },
    { id: 7, task: "Plan weekend trip", status: "in_progress" },
    { id: 8, task: "Update resume", status: "to_do" },
    { id: 9, task: "Prepare for Monday meeting", status: "in_progress" },
    { id: 10, task: "Fix bug in project", status: "to_do" },
  ]);

  const addTask = (task: string, status: Task["status"] = "to_do") => {
    setTasks([...tasks, { id: Date.now(), task, status }]);
  };

  const updateTask = (id: number, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const reorderTasks = (updatedColumnTasks: Task[], status: Task["status"]) => {
    setTasks((prevTasks) => {
      const otherTasks = prevTasks.filter(task => task.status !== status);
  
      return [...otherTasks, ...updatedColumnTasks];
    });
  };
  

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, removeTask, reorderTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

//Doing it this way to prevent TS type errors in App
export const useTaskContext = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
      throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};
