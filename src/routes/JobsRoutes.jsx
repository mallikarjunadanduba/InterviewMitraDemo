import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ForgotPassword from 'views/pages/authentication3/ForgotPassword';
import VerifyOtp from 'views/pages/authentication3/VerifyOtp';
import ResetPassword from 'views/pages/authentication3/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import { element } from 'prop-types';

// dashboard routing
const JobsDefault = Loadable(lazy(() => import('views/Jobs')));

// utilities routing
const UtilsProfile = Loadable(lazy(() => import('views/utilitiess/Jobs/Profile')));
const UtilsSettings = Loadable(lazy(() => import('views/utilitiess/Jobs/Settings')));
const UtilsPayments = Loadable(lazy(() => import('views/utilitiess/Jobs/Payments')));
const UtilsDigitalPreview = Loadable(lazy(() => import('views/utilitiess/Jobs/DigitalPreview')));
const UtilsResumeData = Loadable(lazy(() => import('views/utilitiess/Jobs/ResumeData')));
const UtilsInterviewPreparation = Loadable(lazy(() => import('views/utilitiess/Jobs/InterviewPreparation')));
const UtilsMCQAssessment = Loadable(lazy(() => import('views/utilitiess/Jobs/MCQAssessment')));
const UtilsShortAnswersAssessment = Loadable(lazy(() => import('views/utilitiess/Jobs/ShortAnswersAssessment')));
const UtilsCodingAssessment = Loadable(lazy(() => import('views/utilitiess/Jobs/CodingAssessment')));
const UtilsTests = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/TestInstructions')));
const UtilsExamPage = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ExamPage')));
const UtilsShortAnswersExamPage = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ShortAnswersExamPage')));
const UtilsPlacement = Loadable(lazy(() => import('views/utilitiess/Jobs/Placement')));
const UtilsTabError = Loadable(lazy(() => import('views/utilitiess/MCQTests/Components/TabErrorPage')));
const UtilsMockupInterview = Loadable(lazy(() => import('views/utilitiess/Jobs/MockupInterview')));
const UtilsInterviewSession = Loadable(lazy(() => import('views/utilitiess/Jobs/AIMockSession')));
const UtilsMockInvite = Loadable(lazy(() => import('views/utilitiess/Jobs/MockInvite')));
const UtilsInterviewInterface = Loadable(lazy(() => import('views/utilitiess/Jobs/InterviewSession')));
const UtilsFinalReport = Loadable(lazy(() => import('views/utilitiess/Jobs/InterviewComponents/FinalReport ')));
const UtilsShareProfile = Loadable(lazy(() => import('views/utilitiess/Jobs/ShareProfile')));
const ResultReview = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ResultReview')));
const ShortAnswerResultReview = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ShortAnswerResultReview')));
const ExamSelection = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ExamSelection')));
const PracticeInstructions = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/UpSkillPractice')));
const AcademicPractice = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/AcademicPractice')));
const AcademicTest = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/AcademicTest')));
const ShortAnswersUpSkillPractice = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ShortAnswersUpSkillPractice')));
const ShortAnswersAcademicPractice = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ShortAnswersAcademicPractice')));
const CodingUpSkillPractice = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/CodingUpSkillPractice')));
const CodingAcademicPractice = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/CodingAcademicPractice')));
const CodingExamPage = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/CodingExamPage')));
const ExamHistories = Loadable(lazy(() => import('views/utilitiess/MCQTests/Pages/ExamHistory')));
const AIAgent = Loadable(lazy(() => import('views/utilitiess/Jobs/AIAgent')));
const PdfViewerWithMenu = Loadable(lazy(() => import('views/utilitiess/Jobs/PdfViewerWithMenu')));

const JobsRoutes = {
  path: '/',

  children: [
    { path: '/', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: 'profile/share/:id', element: <UtilsShareProfile /> },
    {
      path: '/',
      element: <ProtectedRoute element={<MainLayout />} />,
      children: [
        {
          path: 'jobs',
          children: [
            { path: '', element: <JobsDefault /> },
            { path: 'profile', element: < UtilsProfile /> },
            { path: 'digitalpreview', element: <UtilsDigitalPreview /> },
            { path: 'resumedata', element: <UtilsResumeData /> },
            { path: 'payments', element: <UtilsPayments /> },
            { path: 'settings', element: <UtilsSettings /> },
            { path: 'interview-preparation', element: <UtilsInterviewPreparation /> },
            { path: 'mcq-assessment', element: <UtilsMCQAssessment /> },
            { path: 'short-answers-assessment', element: <UtilsShortAnswersAssessment /> },
            { path: 'coding-assessment', element: <UtilsCodingAssessment /> },
            { path: 'tests', element: <ExamSelection /> },
            { path: 'test-instructions', element: <UtilsTests /> },
            { path: 'placement', element: <UtilsPlacement /> },
            { path: 'exam', element: <UtilsExamPage /> },
            { path: 'short-answers-exam', element: <UtilsShortAnswersExamPage /> },
            { path: 'tab-error', element: <UtilsTabError /> },
            { path: 'mockup-interview', element: <UtilsMockupInterview /> },
            { path: 'mock-invite', element: <UtilsMockInvite /> },
            { path: 'interview/:sessionId', element: <UtilsInterviewInterface /> },
            { path: 'interview-session/:sessionId', element: <UtilsInterviewSession /> },
            { path: 'interview-session/interview/:sessionId', element: <UtilsInterviewSession /> },
            { path: 'mock-interview-session/:sessionId', element: <UtilsInterviewSession /> },
            { path: 'interview-report/:sessionId', element: <UtilsFinalReport /> },
            { path: 'resultReview', element: <ResultReview /> },
            { path: 'shortAnswerResultReview', element: <ShortAnswerResultReview /> },
            { path: 'exam-selection', element: <ExamSelection /> },
            { path: 'practice-instructions', element: <PracticeInstructions /> },
            { path: 'academic-practice', element: <AcademicPractice /> },
            { path: 'academic-test', element: <AcademicTest /> },
            { path: 'short-answers-upskill-practice', element: <ShortAnswersUpSkillPractice /> },
            { path: 'short-answers-academic-practice', element: <ShortAnswersAcademicPractice /> },
            { path: 'coding-upskill-practice', element: <CodingUpSkillPractice /> },
            { path: 'coding-academic-practice', element: <CodingAcademicPractice /> },
            { path: 'coding-exam', element: <CodingExamPage /> },
            { path: 'examhistory', element: <ExamHistories /> },
            { path: 'ai-agent', element: <AIAgent /> },
            { path: 'pdf-viewer', element: <PdfViewerWithMenu /> }
          ]
        }
      ]
    }
  ]
};

export default JobsRoutes;
