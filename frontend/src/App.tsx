import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CodeRoom from "./pages/CodeRoom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<CodeRoom/>} />
      </Routes>
    </Router>
  );
};
