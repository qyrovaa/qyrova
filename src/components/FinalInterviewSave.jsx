import { createContext, useContext, useState } from "react";

// Create Context
const FinalInterviewContext = createContext();

// Provider Component
export const FinalInterviewProvider = ({ children }) => {
  // stores all Q&A
  const [responses, setResponses] = useState([]);

  // add new response (called after each answer)
  const addResponse = (question, answer) => {
    setResponses((prev) => [
      ...prev,
      {
        question,
        answer,
      },
    ]);
  };

  // reset after interview ends (optional but recommended)
  const clearResponses = () => {
    setResponses([]);
  };

  return (
    <FinalInterviewContext.Provider
      value={{
        responses,
        addResponse,
        clearResponses,
      }}
    >
      {children}
    </FinalInterviewContext.Provider>
  );
};

// custom hook for easy use
export const useFinalInterview = () => {
  return useContext(FinalInterviewContext);
};