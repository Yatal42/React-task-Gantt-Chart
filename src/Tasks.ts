import { Task } from "gantt-task-react";

interface ServerTask {
  id: string;
  nameAndTitle: string;
  start: string;
  end: string;
  type: string;
  project: { name: string };
}

export const transformServerData = (serverData: ServerTask[]): Task[] => {
  return serverData.map(task => ({
    id: task.id.toString(),
    name: task.nameAndTitle,
    start: task.start ? new Date(task.start) : new Date(),
    end: new Date(task.end),
    type: "task", 
    progress: 0,
    dependencies: [],
    project: task.project.name,
    isDisabled: false,
    styles: {
      progressColor: "#176B87",
      progressSelectedColor: "#176B87",
    }
  }));
};

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

export const getStartOrEndDate = (tasks: Task[], id: string): [Date, Date] => {
  const task = tasks.filter(tsk => tsk.project === id);
  let start = task[0].start;
  let end = task[0].end;

  task.forEach(t => {
    if (start > t.start) start = t.start;
    if (end < t.end) end = t.end;
  });

  return [start, end];
};




      