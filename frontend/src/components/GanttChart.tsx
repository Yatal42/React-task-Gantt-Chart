import React, { useState, useEffect, useRef, useCallback } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { initTasks} from "../Tasks";
import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import EditMenu from './EditMenu';

interface GanttChartProps {
  view: ViewMode;
  isChecked: boolean;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  handleSelect: (task: Task, isSelected: boolean) => void;
  selectedTask: Task | null; 
  setSelectedTask: (task: Task | null) => void; 
}

const GanttChart: React.FC<GanttChartProps> = ({
  view,
  isChecked,
  tasks,
  setTasks,
  handleSelect,
  selectedTask,
  setSelectedTask,
}) => {
  const ganttRef = useRef<HTMLDivElement>(null);
  const [listCellWidth, setListCellWidth] = useState<string>("");
  const [colswidth, setColsWidth] = useState(() => window.innerWidth <= 1150 ? 80 : 100);
  const [editMenuOpen, setEditMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const initTasksGantt = await initTasks();
      setTasks(initTasksGantt);
    };
    fetchTasks();
  }, [setTasks]);

  const progressChangeHandler = useCallback(
    (task: Task) => {
      const newTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));
      setTasks([...newTasks]);
      updateTaskOnServer(task);
      console.log("On progress change: " + task.id+" "+ task.progress);
    },
    [tasks, setTasks]
  );

  const updateTaskOnServer = async (task: Task) => {
    try {
      const formattedStart = new Date(task.start).toISOString().split('T')[0];
      const formattedEnd = new Date(task.end).toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
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

  useEffect(() => {
    const handleResize = () => {
      if (isChecked) {
        setColsWidth(window.innerWidth <= 1150 ? 80 : 120);
        setListCellWidth(window.innerWidth <= 1150 ? "100px" : "125px");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChecked]);

  const openEditMenu = (task: Task) => {
    setSelectedTask(task);
    setEditMenuOpen(true);
  };

  const closeEditMenu = () => {
    setEditMenuOpen(false);
  };

  const validTasks = tasks.map(task => ({
    ...task,
    start: task.start || new Date(), 
    end: task.end || new Date(),     
  }));

  if (validTasks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gantt-container" ref={ganttRef}>
      <div className="icon-container">
        {validTasks.map((task) => (
          <IconButton
            key={task.id}
            sx={{
              display: 'inline',
              zIndex: 100,
              height: '40px',
              width: '40px',
              marginBottom: '0px',
              borderRadius: '5px',
              color: "#3e2d47"
            }}
            onClick={() => openEditMenu(task)}>
            <DriveFileRenameOutlineOutlinedIcon />
          </IconButton>
        ))}
      </div>
      <div className="gantt">
        <Gantt
          tasks={validTasks}
          viewMode={view}
          onProgressChange={progressChangeHandler}
          onSelect={handleSelect}
          arrowColor="#a99d9f"
          barFill={55}
          fontFamily="Gill Sans"
          listCellWidth={isChecked ? (window.innerWidth <= 1150 ? "85px" : "100px") : ""}
          fontSize={isChecked ? (window.innerWidth <= 1150 ? "0.6rem" : "0.7rem") : "0.7rem"}
          columnWidth={colswidth}
          rowHeight={40}
        />
      </div>
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