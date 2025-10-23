import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Button, Paper, Divider, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent,
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Swal from "sweetalert2";
import MainCard from 'ui-component/cards/MainCard';
import questionIcon from 'assets/images/InterviewPrepare/formicons/Question.png';
import durationIcon from 'assets/images/InterviewPrepare/formicons/Durations.png';
import sectionsIcon from 'assets/images/InterviewPrepare/formicons/Sections.png';
import modeIcon from 'assets/images/InterviewPrepare/formicons/Mode.png';
import basicsIcon from 'assets/images/InterviewPrepare/formicons/Basics.png';
import timeIcon from 'assets/images/InterviewPrepare/formicons/time.png';
import criticallyIcon from 'assets/images/InterviewPrepare/formicons/critically.png';
import improveIcon from 'assets/images/InterviewPrepare/formicons/improve.png';
import mitraIcon from 'assets/images/InterviewPrepare/formicons/Mitra.png';
import starIcon from 'assets/images/InterviewPrepare/formicons/star.png';

// Static data for coding upskill practice
const codingUpSkillData = {
    topics: [
        { topicId: 1, topicName: "JavaScript Fundamentals" },
        { topicId: 2, topicName: "React.js Concepts" },
        { topicId: 3, topicName: "Node.js & Backend" },
        { topicId: 4, topicName: "Python Programming" },
        { topicId: 5, topicName: "Java Programming" },
        { topicId: 6, topicName: "C++ Programming" },
        { topicId: 7, topicName: "Data Structures" },
        { topicId: 8, topicName: "Algorithms" }
    ],
    expertiseLevels: [
        { expertiseLevelId: 1, levelName: "Beginner" },
        { expertiseLevelId: 2, levelName: "Intermediate" },
        { expertiseLevelId: 3, levelName: "Advanced" },
        { expertiseLevelId: 4, levelName: "Expert" }
    ],
};

const CodingUpSkillPractice = () => {
    const navigate = useNavigate();
    const [isSingleTab, setIsSingleTab] = useState(true);
    const [topicList, setTopicList] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [expertiseLevels, setExpertiseLevels] = useState([]);
    const [selectedExpertiseLevel, setSelectedExpertiseLevel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const tabIdRef = useRef(Date.now());
    const channelRef = useRef(null);

    const testName = "Coding Questions Practice Session";
    const totalQuestions = 10;
    const selectedMode = "PRACTICE";
    const durationMinutes = 30;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.accessToken
    };

    useEffect(() => {
        const channel = new BroadcastChannel('exam_channel');
        channelRef.current = channel;

        channel.postMessage({ type: "check", tabId: tabIdRef.current });

        channel.onmessage = (event) => {
            const { type, tabId } = event.data;
            if (type === "check") {
                channel.postMessage({ type: "active", tabId: tabIdRef.current });
            } else if (type === "active" && tabId !== tabIdRef.current) {
                setIsSingleTab(false);
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    useEffect(() => {
        // Load topics from static data
        setTopicList(codingUpSkillData.topics);
        setExpertiseLevels(codingUpSkillData.expertiseLevels);
    }, []);

    const handleStart = async () => {
        if (!isSingleTab) {
            alert("Another tab is open. Close it before starting.");
            return;
        }

        if (!selectedTopic) {
            Swal.fire("Incomplete", "Please select a topic", "warning");
            return;
        }

        if (!selectedExpertiseLevel) {
            Swal.fire("Incomplete", "Please select expertise level", "warning");
            return;
        }


        const selectedTopicObj = topicList.find(topic => topic.topicId === selectedTopic);
        if (!selectedTopicObj) {
            Swal.fire("Error", "Invalid topic selected", "error");
            return;
        }

        setIsLoading(true);

        // Mock coding questions data
        const mockCodingData = [
            {
                codingId: 1,
                question: "What will be the output of this JavaScript code?",
                questionType: "output",
                codeSnippet: `let x = 5;
let y = 10;
console.log(x + y);
console.log(x - y);
console.log(x * y);`,
                options: [
                    "15, -5, 50",
                    "15, 5, 50",
                    "10, -5, 50",
                    "15, -5, 45"
                ],
                correctAnswer: "15, -5, 50",
                explanation: "The code performs basic arithmetic operations: 5+10=15, 5-10=-5, 5*10=50",
                concept: "JavaScript arithmetic operators"
            },
            {
                codingId: 2,
                question: "Find the error in this React component:",
                questionType: "error",
                codeSnippet: `function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
                options: [
                    "Missing import statement for useState",
                    "Incorrect JSX syntax",
                    "Missing return statement",
                    "No error in the code"
                ],
                correctAnswer: "Missing import statement for useState",
                explanation: "The component uses useState but doesn't import it from React. Should be: import React, { useState } from 'react';",
                concept: "React hooks and imports"
            },
            {
                codingId: 3,
                question: "What will be the output of this Python code?",
                questionType: "output",
                codeSnippet: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(5))`,
                options: [
                    "5",
                    "8",
                    "13",
                    "21"
                ],
                correctAnswer: "5",
                explanation: "The Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5",
                concept: "Recursion and Fibonacci sequence"
            },
            {
                codingId: 4,
                question: "What's wrong with this Java code?",
                questionType: "error",
                codeSnippet: `public class Test {
    public static void main(String[] args) {
        int x = 10;
        int y = 0;
        int result = x / y;
        System.out.println(result);
    }
}`,
                options: [
                    "Division by zero will cause runtime error",
                    "Missing semicolon",
                    "Incorrect variable declaration",
                    "No error in the code"
                ],
                correctAnswer: "Division by zero will cause runtime error",
                explanation: "Dividing by zero in Java throws ArithmeticException at runtime. Need to add error handling.",
                concept: "Exception handling in Java"
            },
            {
                codingId: 5,
                question: "What will be the output of this C++ code?",
                questionType: "output",
                codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    cout << arr[2] << endl;
    cout << *(arr + 3) << endl;
    return 0;
}`,
                options: [
                    "3, 4",
                    "2, 3",
                    "3, 3",
                    "4, 4"
                ],
                correctAnswer: "3, 4",
                explanation: "arr[2] accesses the 3rd element (index 2) which is 3. *(arr + 3) is pointer arithmetic accessing the 4th element which is 4.",
                concept: "Array indexing and pointer arithmetic"
            },
            {
                codingId: 6,
                question: "Find the issue in this Node.js code:",
                questionType: "error",
                codeSnippet: `const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log(data);
    }
});

console.log('File reading started');`,
                options: [
                    "Missing error handling",
                    "File doesn't exist",
                    "Incorrect callback syntax",
                    "No error in the code"
                ],
                correctAnswer: "No error in the code",
                explanation: "This code is syntactically correct. It reads a file asynchronously and handles both success and error cases properly.",
                concept: "Node.js asynchronous file operations"
            },
            {
                codingId: 7,
                question: "What will be the output of this JavaScript code?",
                questionType: "output",
                codeSnippet: `let arr = [1, 2, 3, 4, 5];
let result = arr.map(x => x * 2).filter(x => x > 5);
console.log(result);`,
                options: [
                    "[6, 8, 10]",
                    "[2, 4, 6, 8, 10]",
                    "[6, 8]",
                    "[8, 10]"
                ],
                correctAnswer: "[6, 8, 10]",
                explanation: "map(x => x * 2) doubles each element: [2, 4, 6, 8, 10]. filter(x => x > 5) keeps elements > 5: [6, 8, 10]",
                concept: "JavaScript array methods (map and filter)"
            },
            {
                codingId: 8,
                question: "What's the problem with this Python code?",
                questionType: "error",
                codeSnippet: `def divide_numbers(a, b):
    return a / b

result = divide_numbers(10, 0)
print(result)`,
                options: [
                    "Division by zero error",
                    "Missing return statement",
                    "Incorrect function definition",
                    "No error in the code"
                ],
                correctAnswer: "Division by zero error",
                explanation: "Python will raise ZeroDivisionError when dividing by zero. Need to add try-except block for error handling.",
                concept: "Python exception handling"
            },
            {
                codingId: 9,
                question: "What will be the output of this React code?",
                questionType: "output",
                codeSnippet: `function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        setCount(count + 1);
    }, []);
    
    return <div>{count}</div>;
}`,
                options: [
                    "0",
                    "1",
                    "Infinite loop",
                    "Error"
                ],
                correctAnswer: "1",
                explanation: "useEffect runs once after initial render (empty dependency array), incrementing count from 0 to 1.",
                concept: "React useEffect hook"
            },
            {
                codingId: 10,
                question: "What's wrong with this Java code?",
                questionType: "error",
                codeSnippet: `public class Test {
    public static void main(String[] args) {
        String str = "Hello";
        str = str + " World";
        System.out.println(str);
    }
}`,
                options: [
                    "String concatenation is inefficient",
                    "Missing import statement",
                    "Incorrect string declaration",
                    "No error in the code"
                ],
                correctAnswer: "No error in the code",
                explanation: "This code is syntactically correct. While string concatenation with + creates new objects, it's not an error.",
                concept: "Java string concatenation"
            }
        ];

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (mockCodingData && mockCodingData.length > 0) {
                navigate("/jobs/coding-exam", {
                    state: {
                        codingData: mockCodingData,
                        selectedTopic: selectedTopicObj,
                        selectedMode,
                        expertiseLevelId: selectedExpertiseLevel
                    }
                });
            } else {
                Swal.fire("No Questions", "No Coding questions available for selected filters.", "info");
            }
        } catch (err) {
            console.error("Error fetching coding data:", err);
            Swal.fire("Error", "Failed to load questions. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainCard>
            <Box sx={{ px: { xs: 1, md: 6 }, py: { xs: 3, md: 5 }, maxWidth: { xs: '100%', md: 1200 }, mx: 'auto' }}>
                {/* Main Heading */}
                <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{
                        fontFamily: 'Roboto',
                        fontWeight: 600,
                        fontSize: '24px',
                        lineHeight: '124%',
                        letterSpacing: '1%',
                        color: '#111827',
                        mb: 0.5
                    }}
                >
                    {testName}
                </Typography>

                {/* Subtitle and Back Button Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        sx={{
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'Poppins',
                            color: '#64748B',
                            letterSpacing: '0.35px',
                            lineHeight: '20px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '8px 12px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Back
                    </Button>

                    {/* Centered Subtitle */}
                    <Typography
                        variant="h6"
                        textAlign="center"
                        sx={{
                            color: '#6B7280',
                            lineHeight: '124%',
                            fontWeight: 400,
                            fontSize: '16px',
                            letterSpacing: '1%',
                            fontFamily: 'Roboto',
                            flex: 1
                        }}
                    >
                        Enhance your coding skills with practical exercises and industry-relevant challenges
                    </Typography>

                    {/* Empty space to balance the layout */}
                    <Box sx={{ width: 80 }} />
                </Box>

                {/* Gradient Divider */}
                <Box
                    sx={{
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #2563EB 0%, #6D28D9 100%)',
                        mb: 4
                    }}
                />

                {/* Meta Info Cards */}
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Card
                        elevation={0}
                        sx={{
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={questionIcon}
                            alt="Questions"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            {totalQuestions}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Questions
                        </Typography>
                    </Card>

                    <Card
                        elevation={0}
                        sx={{
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={durationIcon}
                            alt="Duration"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            {durationMinutes} min
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Duration
                        </Typography>
                    </Card>

                    <Card
                        elevation={0}
                        sx={{
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={sectionsIcon}
                            alt="Sections"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            1
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Sections
                        </Typography>
                    </Card>

                    <Card
                        elevation={0}
                        sx={{
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={modeIcon}
                            alt="Mode"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            Practice
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Mode
                        </Typography>
                    </Card>
                </Box>

                {/* Instructions - Two Panel Layout */}
                <Box sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 2, md: 3 },
                    mb: 4,
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'column', md: 'row' }
                }}>
                    {/* Left Panel - Up Skills Instructions */}
                    <Card
                        elevation={0}
                        sx={{
                            flex: { xs: 'none', sm: 'none', md: 1 },
                            width: { xs: '100%', sm: '100%', md: 'auto' },
                            minWidth: { xs: 'auto', sm: 'auto', md: 300 },
                            borderRadius: '16px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            p: { xs: 2, sm: 2, md: 3 }
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 600,
                                fontSize: '18px',
                                color: '#1F2937',
                                mb: 3
                            }}
                        >
                            Coding Questions Practice Instructions
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Start with the Basics */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={basicsIcon}
                                    alt="Basics"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Choose Your Focus
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Select from JavaScript, React, Node.js, Python, Java, C++, Data Structures, or Algorithms
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Manage your time */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={timeIcon}
                                    alt="Time"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Practice Regularly
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Consistent practice helps build muscle memory and problem-solving skills
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Think critically */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={criticallyIcon}
                                    alt="Critically"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Learn from Mistakes
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Review incorrect answers to understand concepts better
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Review and improve */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={improveIcon}
                                    alt="Improve"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Track Progress
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Monitor your improvement and identify areas for further development
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>

                    {/* Right Panel - Mitra Recommends */}
                    <Card
                        elevation={0}
                        sx={{
                            flex: { xs: 'none', sm: 'none', md: 0.6 },
                            width: { xs: '100%', sm: '100%', md: 'auto' },
                            minWidth: { xs: 'auto', sm: 'auto', md: 250 },
                            maxWidth: { xs: 'none', sm: 'none', md: 350 },
                            borderRadius: '16px',
                            backgroundColor: '#E8EFFF',
                            border: '1px solid #00B4D84D',
                            p: { xs: 2, sm: 2, md: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
                            <Box
                                component="img"
                                src={mitraIcon}
                                alt="Mitra"
                                sx={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'Roboto',
                                    fontWeight: 600,
                                    fontSize: '18px',
                                    color: '#1E3A8A'
                                }}
                            >
                                Mitra Recommends
                            </Typography>
                        </Box>

                        {/* Recommendation Cards */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                            {/* Modern Web Technologies Card */}
                            <Card
                                elevation={0}
                                sx={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #00B4D84D',
                                    p: 2.5,
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: '#1F2937',
                                        mb: 1
                                    }}
                                >
                                    Modern Web Technologies
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        color: '#6B7280',
                                        mb: 1.5,
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Focus on JavaScript, React.js, and Node.js for full-stack development
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box
                                        component="img"
                                        src={starIcon}
                                        alt="Star"
                                        sx={{
                                            width: 16,
                                            height: 16
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#2563EB'
                                        }}
                                    >
                                        95% Match Rate
                                    </Typography>
                                </Box>
                            </Card>

                            {/* Practice Schedule Card */}
                            <Card
                                elevation={0}
                                sx={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #00B4D84D',
                                    p: 2.5,
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: '#1F2937',
                                        mb: 1
                                    }}
                                >
                                    Practice Schedule
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        color: '#6B7280',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Optimal time: 4-5 sessions per week, 45 minutes each
                                </Typography>
                            </Card>
                        </Box>
                    </Card>
                </Box>

                {/* Customize Your Practice Form */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        width: { xs: '100%', sm: '100%', md: '100%' },
                        maxWidth: { xs: '100%', sm: '100%', md: 'none' },
                        minHeight: 146,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #B7B7B7',
                        p: 3,
                        boxShadow: 'none',
                        mx: 'auto'
                    }}
                >
                    {/* Title */}
                    <Typography
                        sx={{
                            fontFamily: 'Roboto',
                            fontWeight: 600,
                            fontSize: '18px',
                            color: '#111827',
                            mb: 3
                        }}
                    >
                        Customize Your Practice
                    </Typography>

                    {/* Form Fields */}
                    <Box sx={{
                        display: "flex",
                        gap: { xs: 2, sm: 2, md: 3 },
                        flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" },
                        mb: 3,
                        justifyContent: { xs: "center", sm: "center", md: "space-between" },
                        alignItems: "flex-start",
                        width: "100%"
                    }}>
                        {/* Topic selector */}
                        <FormControl sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 },
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Topic</InputLabel>
                            <Select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                label="Topic"
                            >
                                {topicList.map((topic) => (
                                    <MenuItem key={topic.topicId} value={topic.topicId}>
                                        {topic.topicName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Expertise Level selector */}
                        <FormControl sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 },
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Expertise Level</InputLabel>
                            <Select
                                value={selectedExpertiseLevel}
                                onChange={(e) => setSelectedExpertiseLevel(e.target.value)}
                                label="Expertise Level"
                                disabled={expertiseLevels.length === 0}
                            >
                                {expertiseLevels.length === 0 ? (
                                    <MenuItem disabled>Loading expertise levels...</MenuItem>
                                ) : (
                                    expertiseLevels.map((level) => (
                                        <MenuItem key={level.expertiseLevelId} value={level.expertiseLevelId}>
                                            {level.levelName}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                    </Box>
                </Card>

                {/* Buttons */}
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<PlayArrowIcon />}
                            onClick={handleStart}
                            disabled={isLoading || !isSingleTab}
                            sx={{
                                width: 248,
                                height: 50,
                                fontSize: "16px",
                                fontWeight: 500,
                                backgroundColor: '#2563EB',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 6px -4px #2563EB80, 0px 10px 15px -3px #2563EB80',
                                '&:hover': {
                                    backgroundColor: '#1D4ED8',
                                    boxShadow: '0px 4px 6px -4px #2563EB80, 0px 10px 15px -3px #2563EB80'
                                }
                            }}
                        >
                            {isLoading ? "Loading..." : "Start Your Practice"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default CodingUpSkillPractice;
