// import { Task } from "gantt-task-react";

export const transformServerData = (serverData) => {
    return serverData.map(task => {
        return {
            id: task.id.toString(),
            name: task.nameAndTitle,
            start: task.start ? new Date(task.start) : null,
            end: new Date(task.end),
            type: task.type.toLowerCase(),
            progress: 0, 
            dependencies: [], 
            project: task.project.name, 
            styles: {
                backgroundColor: "#176B87",
                progressColor: "#bac2cb",
                progressSelectedColor: "#bac2cb",
                backgroundSelectedColor: "#112f4f"
            },
        };
    });
};

export const initTasks = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/tasks');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return transformServerData(data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

export const getStartOrEndDate = (tsks , id) => {
    const task = tsks.filter((tsk) => tsk.project === id);
    let start = task[0].start;
    let end = task[0].end;

    for (let i = 0; i < task.length; i++) {
        const task = tsks[i];
        if (start.getTime() > task.start.getTime()) {
            start = task.start;
        }
        if (end.getTime() < task.end.getTime()) {
            end = task.end;
        }
    }
    return [start, end];
};

// export const updateTaskOnServer = async (updatedTask) => {
//     try {
//         const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedTask),
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         console.log('Task updated successfully');
//     } catch (error) {
//         console.error('Error updating task:', error);
//     }
// };

