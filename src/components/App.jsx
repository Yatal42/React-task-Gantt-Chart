import { useState } from "react";
import {ViewMode} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./App.css";
import GanttChart from "./GanttChart";
import ViewSwitcher from "./ViewSwitcher";

function App(){
  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState(ViewMode.Month);
  return (
      <div className="flex-container">
        <ViewSwitcher
            setIsChecked={setIsChecked}
            setView={setView}
            isChecked={isChecked}/>
        <GanttChart isChecked={isChecked} view={view}/>
      </div>
  );
}

export default App;
