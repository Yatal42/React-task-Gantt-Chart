import "gantt-task-react/dist/index.css";
import {ViewMode} from "gantt-task-react";
import Button from "./Button";



function ViewSwitcher({setIsChecked, setView, isChecked}) {
    return (
        <div className="view-switcher">
            <div className="center-container">
                <h1 id="title">Progression</h1>
                <div id="line"></div>
            </div>

            <div className="button-container">
                <Button className="button" text={"Day"} onClick={() => setView(ViewMode.Day)} />
                <Button className="button" text={"Week"} onClick={() => setView(ViewMode.Week)} />
                <Button className="button" text={"Month"} onClick={() => setView(ViewMode.Month)} />
            </div>

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























// function ViewSwitcher({setIsChecked, setView, isChecked}) {
//     return (
//
//         <div className="view-switcher" style={{display: "flex", flexDirection: "column"}}>
//             <div className="center-container">
//                     <h1 id="title">Progression123</h1>
//                     <div id="line"></div>
//             </div>
//
//
//             <div className="view-container">
//                 {/*<Button text={"Quarter of Day"} onClick={() => setView(ViewMode.QuarterDay)} />*/}
//                 {/*<Button text={"Half of Day"} onClick={() => setView(ViewMode.HalfDay)} />*/}
//                     <Button className="button" text={"Day"} onClick={() => setView(ViewMode.Day)}/>
//                     <Button className="button" text={"Week"} onClick={() => setView(ViewMode.Week)}/>
//                     <Button className="button" text={"Month"} onClick={() => setView(ViewMode.Month)}/>
//                 <div className="Switch">
//                     <label className="Switch_Toggle">
//                         <input
//                             type="checkbox"
//                             defaultChecked={isChecked}
//                             onClick={() => setIsChecked(!isChecked)}
//                         />
//                     </label>
//                     Show Task List
//                 </div>
//             </div>
//         </div>
//     );
// };











// import "gantt-task-react/dist/index.css";
// import { ViewMode } from "gantt-task-react";
// import Button from "./Button";
//
// function ViewSwitcher({setIsChecked, setView, isChecked})
// {
//     return (
//         <div className="view-container">
//             {/*<Button text={"Quarter of Day"} onClick={() => setView(ViewMode.QuarterDay)} />*/}
//             {/*<Button text={"Half of Day"} onClick={() => setView(ViewMode.HalfDay)} />*/}
//             <Button text={"Day"} onClick={() => setView(ViewMode.Day)} />
//             <Button text={"Week"} onClick={() => setView(ViewMode.Week)} />
//             <Button text={"Month"} onClick={() => setView(ViewMode.Month)} />
//             <div className="Switch">
//                 <label className="Switch_Toggle">
//                     <input
//                         type="checkbox"
//                         defaultChecked={isChecked}
//                         onClick={() => setIsChecked(!isChecked)}
//                     />
//                 </label>
//                 Show Task List
//             </div>
//         </div>
//     );
// };
//
// export default ViewSwitcher;
