import "./App.css";
import LoginPage from "./pages/Login";
import ChatroomPage from './pages/ChatroomPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chat/:id" element={<ChatroomPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
