export interface Project {
    pid: number;
    title: string;
    start: string; 
    
}

export interface Task {
    tid: number;
    title: string;
    startdate: string; 
    deadline: string; 
    pid: number;
    descriptionText: string;
    dependencies: string[];
    progress: number;
    // project: string;
}