import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../styles/quiz.css";

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuestionAnswered(false);
    try {
      const res = await fetch("http://localhost:3001/api/random-quiz");
      const data = await res.json();
      setQuizData(data);
      setCorrectAnswer(data.answer);
      console.log(data);
    } catch (error) {
      console.error("Quiz verisi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  // İlk render kontrolü
  if (isFirstRender.current) {
    isFirstRender.current = false;
    fetchQuiz();
  }

  const checkAnswer = (selected) => {
    setQuestionAnswered(true);

    if (selected === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setQuizData((prev) => ({
      ...prev,
      selectedAnswer: selected,
    }));
  };

  const getButtonClass = (option) => {
    if (!questionAnswered) return "option-button";
    if (option === correctAnswer) return "option-button correct";
    if (option === quizData.selectedAnswer && option !== correctAnswer)
      return "option-button wrong";
    return "option-button";
  };

  const handleNext = () => {
    if (questionCount < 4) {
      setQuestionCount((prev) => prev + 1);
      fetchQuiz();
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setQuizFinished(false);
    setQuizData(null);
    fetchQuiz();
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="question">Quiz Bitti!</h2>
          <p className="score-display-text">
            Tebrikler! 5 Soruda {score} soru doğru Bildiniz
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <button onClick={handleRestart} className="next-button">
              Tekrar Oyna
            </button>
            <button onClick={() => navigate("/")} className="next-button">
              Quizi Bitir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="score-display">Soru: {questionCount + 1} / 5</div>
        <h2 className="question">{quizData.question}</h2>
        <img src={quizData.image} alt="Araba Görseli" className="car-image" />

        <div className="options">
          {quizData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => checkAnswer(option)}
              className={getButtonClass(option)}
              disabled={questionAnswered}
            >
              {option}
            </button>
          ))}
        </div>
        {questionAnswered && (
          <button onClick={handleNext} className="next-button">
            Sonraki Soru
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
