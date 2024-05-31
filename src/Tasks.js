//import { Task } from "gantt-task-react";
export const initTasks = () => {
    const currentDate = new Date();
    //const tasksFromServer=[{"id":39,"nameAndTitle":"Initiation Document","start":null,"end":"2023-7-17","type":"Plan"},{"id":40,"nameAndTitle":"Customer Requirements Document","start":null,"end":"2023-8-14","type":"Plan"},{"id":41,"nameAndTitle":"Specification Document","start":null,"end":"2023-9-25","type":"Plan"}]
    const tasks = [
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            name: "Some Project",
            id: "ProjectSample",
            progress: 50,
            type: "project",
            isDisabled: true,
            styles:{
                backgroundColor: "#176B87",
                progressColor: "#bac2cb",
                progressSelectedColor:"#bac2cb",
                backgroundSelectedColor:"#176B87"
            },
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                2,
                12,
                28
            ),
            name: "Idea",
            id: "Task 0",
            progress: 45,
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
            name: "Research",
            id: "Task 1",
            progress: 0,
            dependencies: ["Task 0"],
            type: "task",
            project: "ProjectSample",
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
            name: "Discussion with team",
            id: "Task 2",
            progress: 29,
            dependencies: ["Task 1"],
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
            name: "Developing",
            id: "Task 3",
            progress: 15,
            dependencies: ["Task 2"],
            type: "task",
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
            name: "Review",
            id: "Task 4",
            type: "task",
            progress: 70,
            dependencies: ["Task 2"],
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            name: "Release",
            id: "Task 6",
            type: "task",
            progress: 20,
            dependencies: ["Task 4"],
            project: "ProjectSample"
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
            name: "Party Time",
            id: "Task 9",
            progress: 39,
            type: "task",
        },
    ];
    let newTasks = tasks;
    newTasks = tasks.map((task) => {return {...task,};});
    return newTasks;
};


