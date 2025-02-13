import { useDrag, useDrop } from "react-dnd";
import { useTaskContext } from "../context/TaskContext";

interface TaskProps {
  id: number;
  task: string;
  index: number;
  moveTask: (fromIndex: number, toIndex: number) => void;
  fromStatus: string;
}

const TaskCard: React.FC<TaskProps> = ({ id, task, index, moveTask, fromStatus }) => {
  const { removeTask } = useTaskContext();

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id, index, fromStatus },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index; // Update index to prevent flickering
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`border-2 bg-white border-blue-300 rounded w-[95%] min-h-[4rem] flex justify-between items-center px-4 cursor-grab transition-all ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-blue-400 font-bold flex-1">{task}</p>
      <button
        onClick={() => removeTask(id)}
        className="text-red-500 font-bold hover:text-red-700 transition-all"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskCard;
