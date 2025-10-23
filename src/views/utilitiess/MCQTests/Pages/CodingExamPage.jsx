import { Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ExamHeader from '../Components/ExamHeader';
import SidebarNavigation from '../Components/SidebarNavigation';
import CodingQuestionPanel from '../Components/CodingQuestionPanel';
import CodingTimerPanel from '../Components/CodingTimerPanel';
import ExamFooter from '../Components/ExamFooter';
import { saveOrUpdateExamHistory, saveOrUpdateExamResult } from 'views/API/MCATestApi';

const CodingExamPage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { codingData = [], selectedTopic = {}, selectedMode = '' } = location.state || {};
  const seekerId = user?.seekerId;
  const topicId = selectedTopic?.topicId;
  const mode = selectedMode;

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken
  };

  useEffect(() => {
    if (!codingData.length) {
      alert("No Coding data found. Redirecting...");
      navigate("/jobs/coding-assessment");
    } else {
      // Ensure we have exactly 10 questions for practice
      const formattedQuestions = codingData.slice(0, 10).map((item, index) => ({
        id: item.codingId || index + 1,
        question: item.question,
        questionType: item.questionType || 'output',
        codeSnippet: item.codeSnippet,
        options: item.options || [],
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        concept: item.concept || '',
      }));
      setQuestions(formattedQuestions);
    }
  }, [codingData, navigate]);

  // Prevent tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Tab change or minimize detected! Please stay on the exam page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Count multiple tab switches
  useEffect(() => {
    const tabId = Date.now();
    const channel = new BroadcastChannel("exam_channel");

    let localTabSwitchCount = 0;

    const timeoutId = setTimeout(() => {
      if (localTabSwitchCount > 0) {
        alert("Exam is already active in another tab. Closing this one.");
      }
    }, 200);

    channel.postMessage({ type: "new_tab_check", tabId });

    channel.onmessage = (event) => {
      const { type, tabId: incomingTabId } = event.data;

      if (type === "new_tab_check" && incomingTabId !== tabId) {
        channel.postMessage({ type: "existing_tab_response", tabId });
      }

      if (type === "existing_tab_response" && incomingTabId !== tabId) {
        localTabSwitchCount += 1;
        setTabSwitchCount((prev) => prev + 1);
      }
    };

    return () => {
      clearTimeout(timeoutId);
      channel.close();
    };
  }, []);

  // Disable right-click
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  // Handlers
  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setSelectedAnswers({ ...selectedAnswers, [currentPage]: value });
    setQuestionStatus({ ...questionStatus, [currentPage]: 'answered' });
  };

  const handleMarkReview = () => {
    setQuestionStatus({ ...questionStatus, [currentPage]: 'review' });
    setCurrentPage((prev) => Math.min(prev + 1, questions.length));
  };

  const handleClear = () => {
    setSelectedAnswers({ ...selectedAnswers, [currentPage]: '' });
    setQuestionStatus({ ...questionStatus, [currentPage]: 'not_answered' });
  };

  const handleSaveNext = () => {
    const status = selectedAnswers[currentPage] ? 'answered' : 'not_answered';
    setQuestionStatus({ ...questionStatus, [currentPage]: status });
    setCurrentPage((prev) => Math.min(prev + 1, questions.length));
  };

  const getExamStats = () => {
    const total = questions.length;
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[index + 1];
      const correctAnswer = q.correctAnswer;
      if (userAnswer) {
        attempted++;
        if (userAnswer === correctAnswer) correct++;
        else wrong++;
      }
    });

    const unattempted = total - attempted;
    const result = correct >= total / 2 ? 'Pass' : 'Fail';

    return { total, attempted, correct, wrong, unattempted, result };
  };

  const handleSubmit = async () => {
    const { total, attempted, correct, wrong, unattempted, result } = getExamStats();

    const payload = {
      seeker: { seekerId },
      topic: { topicId },
      mode,
      totalQuestions: total,
      attemptedQuestions: attempted,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted,
      tabSwitchCount,
      result
    };

    try {
      // Save Exam History
      const historyResponse = await saveOrUpdateExamHistory(payload, headers);
      console.log("Exam history saved:", historyResponse);

      const examHistoryId = historyResponse.id;
      const promises = codingData.map((item, index) => {
        const questionId = item.codingId;
        const questionText = item.question;
        const correctAnswer = item.correctAnswer;
        const selectedAnswer = selectedAnswers[index + 1] || '';
        const isCorrect = selectedAnswer === correctAnswer;
        const scoreAwarded = isCorrect ? 1.0 : 0.0;
        const penaltyApplied = selectedAnswer && !isCorrect ? -0.25 : 0.0;

        const resultPayload = {
          examHistoryId,
          questionId,
          questionText,
          selectedAnswer,
          correctAnswer,
          isCorrect,
          scoreAwarded,
          penaltyApplied
        };

        return saveOrUpdateExamResult(resultPayload, headers);
      });

      // Wait for all exam result submissions
      await Promise.all(promises);

      Swal.fire('Success', 'Coding Practice submitted successfully!', 'success');
      navigate("/jobs/resultReview", {
        state: {
          historyId: historyResponse.id
        }
      });

    } catch (err) {
      console.error("Failed to submit exam:", err);
      Swal.fire('Error', 'Failed to submit exam. Please try again.', 'error');
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the test?")) {
      navigate("/jobs/coding-assessment");
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const currentQuestion = questions[currentPage - 1] || { question: '', options: [], codeSnippet: '' };
  const selectedAnswer = selectedAnswers[currentPage] || '';

  const questionStatusArray = questions.map((q, index) => ({
    id: index + 1,
    status: questionStatus[index + 1] || 'not_answered',
  }));

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: 'background.paper'
      }}
    >
      <ExamHeader currentPage={currentPage} totalPages={questions.length} />

      <Grid container flex={1}>
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
          sx={{ display: isMobile ? 'none' : 'block', borderRight: 1, borderColor: 'divider' }}
        >
          <SidebarNavigation
            totalQuestions={questions.length}
            currentQuestion={currentPage}
            onNavigate={setCurrentPage}
            questionStatus={questionStatusArray}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8} p={2}>
          <CodingQuestionPanel
            questionData={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerChange={handleAnswerChange}
            showAnswers={showAnswers}
          />
        </Grid>

        <Grid item xs={12} sm={3} md={2} sx={{ borderLeft: 1, borderColor: 'divider' }}>
          <CodingTimerPanel
            initialTime="00:30:00"
            onSubmit={handleSubmit}
            onExit={handleExit}
            onShowAnswers={handleShowAnswers}
            showAnswers={showAnswers}
          />
        </Grid>
      </Grid>

      <Box>
        <ExamFooter
          onMarkReview={handleMarkReview}
          onClear={handleClear}
          onSave={handleSaveNext}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default CodingExamPage;
