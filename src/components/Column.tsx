import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { useTaskContext, Task } from "../context/TaskContext";

interface ColumnProps {
  title: string;
  status: Task["status"];
}

const Column: React.FC<ColumnProps> = ({ title, status }) => {
  const { tasks, addTask, updateTask, reorderTasks } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const filteredTasks = tasks?.filter((task) => task.status === status) || [];

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; fromStatus: string }) => {
      if (item.fromStatus !== status) {
        updateTask(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const moveTask = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || !filteredTasks[fromIndex]) return;

    const updatedTasks = [...filteredTasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);

    reorderTasks(updatedTasks, status);
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return; // Prevent empty tasks
    addTask(newTask, status);
    setNewTask(""); // Reset input
    setIsModalOpen(false); // Close modal
  };

  const getBackgroundColor = () => {
    switch (status) {
      case "to_do":
        return "bg-gradient-to-b from-red-100 to-red-300";
      case "in_progress":
        return "bg-gradient-to-b from-yellow-100 to-yellow-300";
      case "done":
        return "bg-gradient-to-b from-green-100 to-green-300";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      ref={drop}
      className={`w-[23rem] h-[80vh] p-3 border-2 flex flex-col ${getBackgroundColor()} ${
        isOver ? "border-blue-300" : "border-blue-500"
      }`}
    >
      <h2 className="text-blue-500 font-black flex justify-between items-center">
        {title}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-white bg-blue-500 hover:bg-blue-600 rounded-full px-2 text-lg"
        >
          +
        </button>
      </h2>

      {/*Scrollable task container */}
      <div className="flex flex-col gap-2 overflow-y-auto pt-3 min-h-0 flex-grow">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks</p>
        ) : (
          filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              id={task.id}
              task={task.task}
              index={index}
              moveTask={moveTask}
              fromStatus={status}
            />
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-25 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-70">
            <h3 className="text-lg font-bold mb-4">Add New Task</h3>
            <input
              type="text"
              placeholder="Enter task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
