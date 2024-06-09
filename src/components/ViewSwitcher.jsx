import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import EditMenu from "./EditMenu";

function ViewSwitcher({ setIsChecked, setView, isChecked }) {
    const viewsOptions = [
        {
            value: "Day",
            onChange: ViewMode.Day,
        },
        {
            value: "Week",
            onChange: ViewMode.Week,
        },
        {
            value: "Month",
            onChange: ViewMode.Month,
        },
    ];

    const handleChange = (event) => {
        const selectedOption = viewsOptions.find(option => option.value === event.target.value);
        if (selectedOption) {
            setView(selectedOption.onChange);
        }
    };

    return (
        <div className="center-container">
            <div className="heading">
                <h1 id="title">Progression</h1>
                <div id="line"></div>
            </div>
            <div className="view-switcher">
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
                <div className="textField-container">
                    <TextField id="outlined-select-currency"
                        select
                        sx={{ minWidth: 150, margin:5}}
                        label="View options"
                        size="small"
                        onChange={handleChange}>
                        {viewsOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div className="edit-menu">
                    <EditMenu />
                </div>
            </div>
        </div>
    );
}

export default ViewSwitcher;

            // <div className="button-container">
            //     <Button className="button" text={"Day"} onClick={() => setView(ViewMode.Day)} />
            //     <Button className="button" text={"Week"} onClick={() => setView(ViewMode.Week)} />
            //     <Button className="button" text={"Month"} onClick={() => setView(ViewMode.Month)} />
            // </div>  