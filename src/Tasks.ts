import { Task } from "gantt-task-react";

// Define the structure of a task as it is received from the server.
interface ServerTask {
  id: string;
  nameAndTitle: string;
  start: string;
  end: string;
  type: string;
  project: { name: string };
  dependencies?: string[];
  progress: number;
}

// Function to transform server data into the format required by the Gantt chart component.
export const transformServerData = (serverData: ServerTask[]): Task[] => {
  return serverData.map(task => {
    const startDate = task.start ? new Date(task.start) : new Date(); 
    const endDate = task.end ? new Date(task.end) : new Date(); 

    return {
      id: task.id.toString(),
      name: task.nameAndTitle,
      start: startDate,
      end: endDate,
      type: "task", 
      progress: task.progress || 0,
      dependencies: task.dependencies || [], 
      project: task.project.name,
      isDisabled: false,
      styles: {
        progressColor: "#176B87",
        progressSelectedColor: "#176B87",
      }
    };
  });
};

// Function to initialize tasks by fetching them from the server.
export const initTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/tasks');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ServerTask[] = await response.json();
    return transformServerData(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};





      