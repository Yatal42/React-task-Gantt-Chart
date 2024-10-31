# Task Gantt-Chart

## Description

Task Gantt-Chart is a web application that allows users to manage and visualize their projects using an interactive Gantt chart. Users can create projects, add tasks with dependencies, track progress, and manage their project timelines efficiently.

## Preview

[![Watch the video](src/images/video-thumbnail.png)](https://youtu.be/mx6-K3wZFmE)

## Features

- **Project Management:** Create, update, and delete projects.
- **Task Management:** Add, edit, and delete tasks within projects.
- **Dependencies:** Define dependencies between tasks to visualize task relationships.
- **Interactive Gantt Chart:** View and interact with project timelines.
- **Responsive Design:** Optimized for various devices and screen sizes.
- **Real-time Updates:** Tasks and dependencies update in real-time.
- **User Notifications:** Alerts when attempting actions without selecting a project.

## Technologies Used

### Frontend

- **React**
- **TypeScript**
- **CSS**
- **Material-UI (MUI)**
- **NPM gantt-task-react**

### Backend

- **Node.js**
- **Express.js**
- **MySQL**

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** database

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/task-gantt-chart.git
   cd task-gantt-chart/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the `backend` directory with the following content:

   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=8080
   ```

4. **Set Up the Database:**

   - **Create the Database:**

     ```sql
     CREATE DATABASE your_database_name;
     ```

   - **Use the Database:**

     ```sql
     USE your_database_name;
     ```

   - **Create Tables:**

     ```sql
     CREATE TABLE project (
       pid INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       startdate DATE,
       deadline DATE
     );

     CREATE TABLE task (
       tid INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       startdate DATE NOT NULL,
       deadline DATE NOT NULL,
       pid INT,
       descriptionText TEXT,
       dependencies JSON,
       progress INT,
       FOREIGN KEY (pid) REFERENCES project(pid) ON DELETE CASCADE
     );
     ```

   - **Insert Sample Data (Optional):**

     ```sql
     INSERT INTO project (title, description, startdate, deadline)
     VALUES
     ('Project Alpha', 'Initial project setup', '2023-12-01', '2024-06-01');

     INSERT INTO task (title, startdate, deadline, pid, descriptionText, dependencies, progress)
     VALUES
     ('System Planning', '2023-12-30', '2024-01-18', 1, 'Initial planning of the Gantt system', '[]', 48),
     ('Module Development', '2023-12-30', '2024-02-04', 1, 'Developing main modules', '[]', 39),
     ('Testing', '2023-12-30', '2024-02-11', 1, 'Comprehensive system testing', '[1]', 55);
     ```

5. **Start the Backend Server:**

   ```bash
   npm start
   ```

   The server should be running at `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the Frontend Directory:**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Frontend Development Server:**

   ```bash
   npm start
   ```

   The frontend should be running at `http://localhost:3000`.

## Usage

1. **Open the Application:**

   Navigate to `http://localhost:3000` in your web browser.

2. **Select a Project:**

   - If no project is selected, create a new project or select an existing one from the project selector.

3. **Add Tasks:**

   - Click on the "Add Task" button to open the dialog for adding a new task.
   - Fill in the task details including name, description, start date, end date, and dependencies.
   - If no project is selected or "All Tasks" is selected, an alert will prompt you to select a project first.

4. **View and Manage Gantt Chart:**

   - The Gantt chart will display all tasks with their respective timelines and dependencies.
   - Click on task icons to edit task details.
   - Update task progress directly from the chart.

5. **Responsive Design:**

   - The application is responsive and optimized for various screen sizes including mobile devices, tablets, and desktops.

## License

This project is licensed under the [MIT License](LICENSE).
