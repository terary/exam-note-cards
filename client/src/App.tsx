import { Routes, Route, Navigate } from "react-router-dom";
import DatabaseListPage from "./pages/DatabaseListPage";
import QuizPage from "./pages/QuizPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DatabaseListPage />} />
      <Route path="/quiz/:databaseId" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
