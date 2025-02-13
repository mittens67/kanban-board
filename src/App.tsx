import Navbar from "./components/Navbar";
import Column from "./components/Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />
      <main className="flex justify-center gap-4 py-[3rem] h-[calc(100vh-3rem)] bg-gray-300 min-w-[1200px]">
        <Column title="TO DO" status="to_do" />
        <Column title="IN PROGRESS" status="in_progress" />
        <Column title="DONE" status="done" />
      </main>
    </DndProvider>
  );
}

export default App;
