// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Araba Bilgi Yarışması</h1>
        <p className="home-description">
          Araba modellerini ne kadar iyi tanıyorsun? Hemen test et!
        </p>
        <button onClick={handleStartQuiz} className="start-button">
          Başla
        </button>
      </div>
    </div>
  );
};

export default Home;
