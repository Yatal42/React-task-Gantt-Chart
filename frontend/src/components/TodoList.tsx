import React, { useState, useEffect } from 'react';
import { Checkbox, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Button from './Button';

interface Todo {
    id: number;
    task: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        const savedState = localStorage.getItem('todoPanelOpen');
        return savedState ? JSON.parse(savedState) : false;
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/todo')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTodos(data); 
                } else {
                    console.error('Unexpected response format:', data);
                    setTodos([]); 
                }
            })
            .catch(error => console.error('Error fetching todos:', error));
    }, []);

    useEffect(() => {
        localStorage.setItem('todoPanelOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    const handleAddTodo = () => {
        if (!newTask.trim()) {
            setError('Please enter a task before adding.');
            return;
        }

        setError('');

        fetch('http://localhost:8080/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: newTask }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                setTodos([...todos, data]);
                setNewTask('');
            })
            .catch(error => console.error('Error adding todo:', error));
    };

    const handleToggleCompleted = (id: number, completed: boolean) => {
        fetch(`http://localhost:8080/api/todo/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !completed } : todo)));
            })
            .catch(error => console.error('Error updating todo:', error));
    };

    const handleDeleteTodo = (id: number) => {
        fetch(`http://localhost:8080/api/todo/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(error => console.error('Error deleting todo:', error));
    };

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="open-todo-button" onClick={togglePanel}>
                {isOpen ? <CloseIcon /> : "TODO"}
            </button>

            <div className={`todo-overlay ${isOpen ? 'open' : ''}`} onClick={togglePanel}></div>

            <div className={`todo-panel ${isOpen ? 'open' : ''}`}>
                <div className="todo-container">
                    <h2 id="title">TODO List</h2>
                    <div className='todo-heading'>
                        <TextField
                            label="New Task"
                            value={newTask}
                            onChange={e => setNewTask(e.target.value)}
                            color="secondary"
                            multiline
                            required
                            fullWidth
                            error={!!error}
                            helperText={error}
                        />
                        <Button onClick={handleAddTodo} text={"Add Task"} />
                    </div>
                    <List className="todo-list">
                        {Array.isArray(todos) && todos.map(todo => (
                            <ListItem key={todo.id} secondaryAction={
                                <IconButton edge="end" onClick={() => handleDeleteTodo(todo.id)} className="delete-button">
                                    <DeleteIcon />
                                </IconButton>
                            } className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                <Checkbox
                                    checked={todo.completed}
                                    onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                                    color="secondary"
                                />
                                <ListItemText
                                    primary={todo.task}
                                    className="todo-task"
                                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        </>
    );
};

export default TodoList;