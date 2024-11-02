export interface Project {
    pid: number;
    title: string;
    start: string; 
    
}

export interface Task {
    tid: number; // CR: should be "id"
    title: string;
    startdate: string; // CR: startDate
    deadline: string;
    pid: number; // CR: what is pid? projectId? be specific
    descriptionText: string; // CR: adding the "Text" suffix is redundant, because it is a string
    dependencies: string[]; // CR: very confusing, haven't looked at all the code but I hope this is not a list of Ids
    progress: number; 
}