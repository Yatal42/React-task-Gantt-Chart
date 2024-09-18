import React, { useState, useEffect, useRef, useCallback } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { initTasks} from "../Tasks";
import IconButton from "@mui/material/IconButton";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import EditMenu from './EditMenu';

// Define the props interface for the GanttChart component.
interface GanttChartProps {
  view: ViewMode;
  isChecked: boolean;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  handleSelect: (task: Task, isSelected: boolean) => void;
  selectedTask: Task | null; 
  setSelectedTask: (task: Task | null) => void; 
}

// The GanttChart component displays a Gantt chart with tasks and allows editing of selected tasks.
const GanttChart: React.FC<GanttChartProps> = ({
  view,
  isChecked,
  tasks,
  setTasks,
  handleSelect,
  selectedTask,
  setSelectedTask,
}) => {
  // Reference to the Gantt chart container
  const ganttRef = useRef<HTMLDivElement>(null);
  // Width of the task list cells
  const [listCellWidth, setListCellWidth] = useState<string>("");
  // Column width based on screen size
  const [colswidth, setColsWidth] = useState(() => window.innerWidth <= 1150 ? 100 : 165);
  // State to control the visibility of the edit menu
  const [editMenuOpen, setEditMenuOpen] = useState<boolean>(false);

  // Fetch initial tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      const initTasksGantt = await initTasks();
      setTasks(initTasksGantt);
    };
    fetchTasks();
  }, [setTasks]);

  // Handle progress change for tasks and update the server
  const progressChangeHandler = useCallback(
    (task: Task) => {
      const newTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));
      setTasks([...newTasks]);
      updateTaskOnServer(task);
      console.log("On progress change: " + task.id+" "+ task.progress);
    },
    [tasks, setTasks]
  );

  // Update a specific task on the server
  const updateTaskOnServer = async (task: Task) => {
    try {
      const formattedStart = new Date(task.start).toISOString().split('T')[0];
      const formattedEnd = new Date(task.end).toISOString().split('T')[0];

      const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameAndTitle: task.name, 
          start: formattedStart,
          end: formattedEnd,
          dependencies: task.dependencies || [], 
          progress: task.progress
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error('Server error response:', errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Task updated on server:', data);

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating task on server:', error.message);
      } else {
        console.error('Unknown error updating task on server:', error);
      }
    }
  };

  // Handle window resizing to adjust list cell width and column width
  useEffect(() => {
    const handleResize = () => {
      if (isChecked) {
        setColsWidth(window.innerWidth <= 1150 ? 100 : 165);
        setListCellWidth(window.innerWidth <= 1150 ? "125px" : "160px");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChecked]);

  // Open the edit menu for the selected task
  const openEditMenu = (task: Task) => {
    setSelectedTask(task);
    setEditMenuOpen(true);
  };

  // Close the edit menu
  const closeEditMenu = () => {
    setEditMenuOpen(false);
  };

  // Ensure all tasks have valid start and end dates
  const validTasks = tasks.map(task => ({
    ...task,
    start: task.start || new Date(), 
    end: task.end || new Date(),     
  }));

  // Render a loading message if there are no tasks to display yet
  if (validTasks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gantt-container" ref={ganttRef}>
      <div className="icon-container">
        {/* Render edit icons for each task */}
        {validTasks.map((task) => (
          <IconButton
            key={task.id}
            style={{
              display: 'inline',
              zIndex: 100,
              height: '40px',
              width: '40px',
              marginBottom: '0px',
              borderRadius: '5px'
            }}
            onClick={() => openEditMenu(task)}
          >
            <EditNoteOutlinedIcon />
          </IconButton>
        ))}
      </div>
      <div className="gantt">
        {/* Render the Gantt chart */}
        <Gantt
          tasks={validTasks}
          viewMode={view}
          onProgressChange={progressChangeHandler}
          onSelect={handleSelect}
          arrowColor="#a99d9f"
          barFill={55}
          fontFamily="Montserrat, self-serif"
          listCellWidth={
            isChecked ? (window.innerWidth <= 1150 ? "100px" : "160px") : ""
          }
          fontSize={
            isChecked ? (window.innerWidth <= 1150 ? "0.6rem" : "0.7rem") : "0.7rem"
          }
          columnWidth={colswidth}
          rowHeight={40}
        />
      </div>
      {/* Render the edit menu for the selected task */}
      <EditMenu
        open={editMenuOpen}
        onClose={closeEditMenu}
        selectedTask={selectedTask}
        tasks={validTasks}
        setTasks={setTasks}
      />
    </div>
  );
};

export default GanttChart;