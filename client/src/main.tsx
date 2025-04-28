import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
