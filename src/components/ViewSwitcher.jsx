import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import Button from "./Button";

function ViewSwitcher({setIsChecked, setView, isChecked})
{
    return (
        <div className="view-container">
            {/*<Button text={"Quarter of Day"} onClick={() => setView(ViewMode.QuarterDay)} />*/}
            {/*<Button text={"Half of Day"} onClick={() => setView(ViewMode.HalfDay)} />*/}
            <Button text={"Day"} onClick={() => setView(ViewMode.Day)} />
            <Button text={"Week"} onClick={() => setView(ViewMode.Week)} />
            <Button text={"Month"} onClick={() => setView(ViewMode.Month)} />
            <div className="Switch">
                <label className="Switch_Toggle">
                    <input
                        type="checkbox"
                        defaultChecked={isChecked}
                        onClick={() => setIsChecked(!isChecked)}
                    />
                </label>
                Show Task List
            </div>
        </div>
    );
};

export default ViewSwitcher;
