import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CodeRoom from "./pages/CodeRoom";
import LandingPage from "./pages/LandingPage";
import HowToUse from "./pages/HowToUse";
import Error404Page from "./pages/Error404Page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/how" element={<HowToUse/>}></Route>
        <Route path="/:id" element={<CodeRoom/>} />

        <Route path="*" element={<Error404Page/>}></Route>
      </Routes>
    </Router>
  );
};
