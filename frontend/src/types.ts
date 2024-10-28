// src/types.ts

export interface Project {
    pid: number;
    title: string;
    start: string; // פורמט 'YYYY-MM-DD'
}

export interface Task {
    tid: number;
    title: string;
    startdate: string; // פורמט 'YYYY-MM-DD'
    deadline: string; // פורמט 'YYYY-MM-DD'
    pid: number;
    descriptionText: string;
    dependencies: string[];
    progress: number;
}