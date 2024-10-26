import React from "react";

// Define the props interface for the Button component.
interface ButtonProps {
  text: string;
  onClick: () => void;
}

// The Button component renders a simple button with text and an onClick handler.
const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="button">{text}</button>
  );
};

export default Button;
