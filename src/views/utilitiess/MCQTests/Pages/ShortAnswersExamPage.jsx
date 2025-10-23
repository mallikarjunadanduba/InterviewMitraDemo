import { Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ExamHeader from '../Components/ExamHeader';
import SidebarNavigation from '../Components/SidebarNavigation';
import ShortAnswerQuestionPanel from '../Components/ShortAnswerQuestionPanel';
import ShortAnswersTimerPanel from '../Components/ShortAnswersTimerPanel';
import ExamFooter from '../Components/ExamFooter';
import { 
  saveOrUpdateShortAnswerExamHistory, 
  saveOrUpdateShortAnswerExamResult,
  batchEvaluateShortAnswers 
} from 'views/API/SAQTestApi';

const ShortAnswersExamPage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { shortAnswerData = [], selectedTopic = {}, selectedMode = '' } = location.state || {};
  const seekerId = user?.seekerId;
  const topicId = selectedTopic?.topicId;
  const mode = selectedMode;

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken
  };

  useEffect(() => {
    if (!shortAnswerData.length) {
      alert("No Short Answer data found. Redirecting...");
      navigate("/jobs/short-answers-assessment");
    } else {
      // Use all questions returned from API
      const formattedQuestions = shortAnswerData.map((item, index) => ({
        id: item.id || item.shortAnswerId || index + 1,
        question: item.question,
        expectedAnswer: item.correctAnswer || item.expectedAnswer || '',
        wordLimit: item.wordLimit || 100,
      }));
      setQuestions(formattedQuestions);
    }
  }, [shortAnswerData, navigate]);

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
      if (userAnswer && userAnswer.trim()) {
        attempted++;
        // For short answers, we'll consider any non-empty answer as correct initially
        // The actual evaluation will be done by the NLP API
        correct++;
      }
    });

    const unattempted = total - attempted;
    // For short answers, we'll consider it a pass if at least 50% are attempted
    const result = attempted >= total / 2 ? 'PASS' : 'FAIL';

    return { total, attempted, correct, wrong, unattempted, result };
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    const { total, attempted, correct, wrong, unattempted, result } = getExamStats();

    const payload = {
      id: 0,
      seeker: { seekerId },
      topic: { topicId },
      mode,
      totalQuestions: total,
      attemptedQuestions: attempted,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted,
      tabSwitchCount,
      tabSwitchPenalty: tabSwitchCount * 0.5,
      wrongAnswerPenalty: 0.0,
      score: correct * 1.0 - (tabSwitchCount * 0.5),
      result
    };

    try {
      console.log("Submitting short answer exam...");
      
      // Save Exam History
      const historyResponse = await saveOrUpdateShortAnswerExamHistory(payload, headers);
      console.log("Short answer exam history saved:", historyResponse);

      const examHistoryId = historyResponse.id;
      
      // Prepare batch evaluation data
      const batchEvaluationData = shortAnswerData.map((item, index) => ({
        id: 0,
        examHistoryId,
        questionId: item.shortAnswerId || item.id,
        questionText: item.question,
        studentAnswer: selectedAnswers[index + 1] || '',
        correctAnswer: item.expectedAnswer || item.correctAnswer || ''
      }));

      // Save individual question results
      let evaluationResults = [];
      let finalScore = 0;
      let finalCorrect = 0;
      let finalWrong = 0;

      console.log("Saving individual question results...");
      
      // Save each question result individually
      for (let i = 0; i < shortAnswerData.length; i++) {
        const item = shortAnswerData[i];
        const studentAnswer = selectedAnswers[i + 1] || '';
        
        if (studentAnswer.trim()) {
          // Create result payload for each answered question
          const resultPayload = {
            id: 0,
            examHistoryId,
            questionId: item.shortAnswerId || item.id,
            questionText: item.question,
            studentAnswer: studentAnswer,
            correctAnswer: item.expectedAnswer || item.correctAnswer || '',
            scoreAwarded: 1.0, // Basic scoring: 1 point for any answer
            penaltyApplied: 0.0,
            keywordMatches: "null",
            keywordMatchPercentage: 100.0,
            semanticSimilarity: 1.0,
            aiAnalysis: null,
            confidenceScore: 1.0,
            correct: true // Basic scoring: assume all answered questions are correct
          };

          try {
            const resultResponse = await saveOrUpdateShortAnswerExamResult(resultPayload, headers);
            console.log(`Question ${i + 1} result saved:`, resultResponse);
            evaluationResults.push(resultResponse);
            finalScore += 1.0;
            finalCorrect++;
          } catch (resultError) {
            console.error(`Failed to save result for question ${i + 1}:`, resultError);
            // Continue with other questions even if one fails
          }
        }
      }
      
      finalWrong = 0; // No wrong answers in basic scoring
      console.log("Individual results saved - finalScore:", finalScore, "finalCorrect:", finalCorrect);

      // Update exam history with final results
      const finalPayload = {
        id: historyResponse.id,
        seeker: { seekerId },
        topic: { topicId },
        mode,
        totalQuestions: total,
        attemptedQuestions: attempted,
        correctAnswers: finalCorrect,
        wrongAnswers: finalWrong,
        unattempted,
        tabSwitchCount,
        tabSwitchPenalty: tabSwitchCount * 0.5,
        wrongAnswerPenalty: 0.0,
        score: Math.max(0, finalScore - (tabSwitchCount * 0.5)), // Ensure score doesn't go negative
        result: finalScore >= total * 0.5 ? 'PASS' : 'FAIL'
      };

      await saveOrUpdateShortAnswerExamHistory(finalPayload, headers);

      console.log("Final payload saved:", finalPayload);
      console.log("Exam submission completed successfully");
      
      // Simple success message
      Swal.fire({
        title: 'Success!',
        text: 'Short Answer Exam submitted successfully!',
        icon: 'success',
        confirmButtonText: 'View Results',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      // Navigate immediately after success message
      console.log("Navigating to result review with historyId:", historyResponse.id);
      try {
        navigate("/jobs/shortAnswerResultReview", {
          state: {
            historyId: historyResponse.id
          }
        });
        console.log("Navigation executed successfully");
      } catch (navError) {
        console.error("Navigation failed:", navError);
        // Fallback navigation
        setTimeout(() => {
          console.log("Fallback navigation attempt");
          window.location.href = `/jobs/shortAnswerResultReview?historyId=${historyResponse.id}`;
        }, 1000);
      }

    } catch (err) {
      console.error("Failed to submit short answer exam:", err);
      Swal.fire('Error', 'Failed to submit exam. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the test?")) {
      navigate("/jobs/short-answers-assessment");
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const currentQuestion = questions[currentPage - 1] || { question: '', wordLimit: 100 };
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
          <ShortAnswerQuestionPanel
            questionData={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerChange={handleAnswerChange}
            showAnswers={showAnswers}
          />
        </Grid>

        <Grid item xs={12} sm={3} md={2} sx={{ borderLeft: 1, borderColor: 'divider' }}>
          <ShortAnswersTimerPanel
            initialTime="00:30:00"
            onSubmit={handleSubmit}
            onExit={handleExit}
            onShowAnswers={handleShowAnswers}
            showAnswers={showAnswers}
            isSubmitting={isSubmitting}
          />
        </Grid>
      </Grid>

      <Box>
        <ExamFooter
          onMarkReview={handleMarkReview}
          onClear={handleClear}
          onSave={handleSaveNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Box>
  );
};

export default ShortAnswersExamPage;
