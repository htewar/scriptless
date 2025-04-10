"use client"
import { StrictMode } from 'react'
import App from './App'
import "xterm/css/xterm.css";
import "reactflow/dist/style.css";
import './styles/main.scss';

export default function Page() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}