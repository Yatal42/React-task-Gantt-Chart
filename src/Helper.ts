import { Task } from "gantt-task-react";

export const getStartOrEndDate = (tsks: Task[], id: string) => {
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
