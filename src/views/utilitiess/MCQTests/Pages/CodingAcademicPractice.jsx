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

// Static data for coding academic practice
const codingAcademicData = {
  sections: {
    dataStructures: {
      name: "Data Structures",
      questions: [
        {
          codingId: 1,
          question: "What will be the output of this stack implementation?",
          questionType: "output",
          codeSnippet: `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        return this.items.pop();
    }
}

let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop());
console.log(stack.pop());`,
          options: [
            "30, 20",
            "20, 10",
            "10, 20",
            "30, 10"
          ],
          correctAnswer: "30, 20",
          explanation: "Stack follows LIFO (Last In, First Out). push(10), push(20), push(30). pop() returns 30, pop() returns 20.",
          concept: "Stack data structure - LIFO principle"
        },
        {
          codingId: 2,
          question: "Find the error in this queue implementation:",
          questionType: "error",
          codeSnippet: `class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        return this.items.shift();
    }
    
    front() {
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}

let queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue());`,
          options: [
            "Missing error handling for empty queue",
            "Incorrect dequeue implementation",
            "Missing return statement",
            "No error in the code"
          ],
          correctAnswer: "Missing error handling for empty queue",
          explanation: "The dequeue() method should check if queue is empty before calling shift() to avoid returning undefined.",
          concept: "Queue data structure and error handling"
        },
        {
          codingId: 3,
          question: "What will be the output of this binary tree traversal?",
          questionType: "output",
          codeSnippet: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

function inorderTraversal(root) {
    if (!root) return [];
    return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)];
}

// Tree:     1
//          / \\
//         2   3
//        / \\
//       4   5

let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log(inorderTraversal(root));`,
          options: [
            "[4, 2, 5, 1, 3]",
            "[1, 2, 4, 5, 3]",
            "[4, 5, 2, 3, 1]",
            "[1, 3, 2, 5, 4]"
          ],
          correctAnswer: "[4, 2, 5, 1, 3]",
          explanation: "Inorder traversal: Left -> Root -> Right. Traverse left subtree (4, 2, 5), then root (1), then right subtree (3).",
          concept: "Binary tree inorder traversal"
        },
        {
          codingId: 4,
          question: "What's wrong with this hash table implementation?",
          questionType: "error",
          codeSnippet: `class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.table = new Array(size);
    }
    
    hash(key) {
        return key.length % this.size;
    }
    
    set(key, value) {
        const index = this.hash(key);
        this.table[index] = value;
    }
    
    get(key) {
        const index = this.hash(key);
        return this.table[index];
    }
}`,
          options: [
            "No collision handling",
            "Incorrect hash function",
            "Missing size validation",
            "No error in the code"
          ],
          correctAnswer: "No collision handling",
          explanation: "The hash function can produce same index for different keys, causing collisions. Need chaining or open addressing.",
          concept: "Hash table collision handling"
        },
        {
          codingId: 5,
          question: "What will be the output of this linked list operation?",
          questionType: "output",
          codeSnippet: `class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

// List: 1 -> 2 -> 3 -> null
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);

let reversed = reverseList(head);
console.log(reversed.val, reversed.next.val, reversed.next.next.val);`,
          options: [
            "3, 2, 1",
            "1, 2, 3",
            "3, 1, 2",
            "Error"
          ],
          correctAnswer: "3, 2, 1",
          explanation: "The function reverses the linked list. Original: 1->2->3, Reversed: 3->2->1.",
          concept: "Linked list reversal algorithm"
        }
      ]
    },
    algorithms: {
      name: "Algorithms",
      questions: [
        {
          codingId: 6,
          question: "What will be the output of this sorting algorithm?",
          questionType: "output",
          codeSnippet: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

let numbers = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(numbers));`,
          options: [
            "[11, 12, 22, 25, 34, 64, 90]",
            "[90, 64, 34, 25, 22, 12, 11]",
            "[64, 34, 25, 12, 22, 11, 90]",
            "[12, 11, 22, 25, 34, 64, 90]"
          ],
          correctAnswer: "[11, 12, 22, 25, 34, 64, 90]",
          explanation: "Bubble sort repeatedly compares adjacent elements and swaps them if they're in wrong order, resulting in sorted array.",
          concept: "Bubble sort algorithm"
        },
        {
          codingId: 7,
          question: "Find the issue in this binary search implementation:",
          questionType: "error",
          codeSnippet: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid;
        } else {
            right = mid;
        }
    }
    return -1;
}`,
          options: [
            "Incorrect right boundary initialization",
            "Missing mid calculation",
            "Wrong comparison logic",
            "No error in the code"
          ],
          correctAnswer: "Incorrect right boundary initialization",
          explanation: "Right should be arr.length - 1, not arr.length, to avoid accessing out-of-bounds index.",
          concept: "Binary search boundary conditions"
        },
        {
          codingId: 8,
          question: "What will be the output of this recursive function?",
          questionType: "output",
          codeSnippet: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6));`,
          options: [
            "8",
            "13",
            "21",
            "5"
          ],
          correctAnswer: "8",
          explanation: "Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8",
          concept: "Recursive algorithms and Fibonacci"
        },
        {
          codingId: 9,
          question: "What's wrong with this dynamic programming solution?",
          questionType: "error",
          codeSnippet: `function climbStairs(n) {
    if (n <= 2) return n;
    
    let dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`,
          options: [
            "Missing base case handling",
            "Incorrect array initialization",
            "Wrong recurrence relation",
            "No error in the code"
          ],
          correctAnswer: "No error in the code",
          explanation: "This is a correct implementation of the climbing stairs problem using dynamic programming.",
          concept: "Dynamic programming and memoization"
        },
        {
          codingId: 10,
          question: "What will be the output of this graph traversal?",
          questionType: "output",
          codeSnippet: `function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start);
    
    for (let neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}

let graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
};

dfs(graph, 'A');`,
          options: [
            "A B D C",
            "A C D B",
            "A B C D",
            "A D B C"
          ],
          correctAnswer: "A B D C",
          explanation: "DFS visits A, then B (first neighbor), then D (neighbor of B), then C (neighbor of D).",
          concept: "Depth-first search (DFS) algorithm"
        }
      ]
    },
    databases: {
      name: "Database Systems",
      questions: [
        {
          codingId: 11,
          question: "What will be the result of this SQL query?",
          questionType: "output",
          codeSnippet: `SELECT name, age 
FROM users 
WHERE age > 25 
ORDER BY age DESC 
LIMIT 3;`,
          options: [
            "Top 3 oldest users over 25",
            "All users over 25",
            "Top 3 youngest users over 25",
            "Error in query"
          ],
          correctAnswer: "Top 3 oldest users over 25",
          explanation: "Query filters users over 25, orders by age descending (oldest first), and limits to 3 results.",
          concept: "SQL query with WHERE, ORDER BY, and LIMIT"
        },
        {
          codingId: 12,
          question: "Find the issue in this database transaction:",
          questionType: "error",
          codeSnippet: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- Missing COMMIT or ROLLBACK`,
          options: [
            "Missing COMMIT statement",
            "No error handling",
            "Incorrect UPDATE syntax",
            "No error in the code"
          ],
          correctAnswer: "Missing COMMIT statement",
          explanation: "Transaction must be committed with COMMIT or rolled back with ROLLBACK to make changes permanent.",
          concept: "Database transaction management"
        },
        {
          codingId: 13,
          question: "What will be the output of this JOIN query?",
          questionType: "output",
          codeSnippet: `SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.city = 'New York';`,
          options: [
            "All users from New York with their orders",
            "Only users from New York who have orders",
            "All orders from New York users",
            "Error in JOIN syntax"
          ],
          correctAnswer: "All users from New York with their orders",
          explanation: "LEFT JOIN returns all users from New York, including those without orders (NULL values).",
          concept: "SQL LEFT JOIN operation"
        },
        {
          codingId: 14,
          question: "What's wrong with this database index creation?",
          questionType: "error",
          codeSnippet: `CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_name ON users(name);
CREATE INDEX idx_user_email_name ON users(email, name);`,
          options: [
            "Redundant indexes",
            "Incorrect syntax",
            "Missing table specification",
            "No error in the code"
          ],
          correctAnswer: "Redundant indexes",
          explanation: "The composite index (email, name) can serve queries on email alone, making the single email index redundant.",
          concept: "Database indexing strategy"
        },
        {
          codingId: 15,
          question: "What will be the result of this aggregation query?",
          questionType: "output",
          codeSnippet: `SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;`,
          options: [
            "Departments with more than 5 employees",
            "All departments with employee count and average salary",
            "Top 5 departments by employee count",
            "Error in GROUP BY clause"
          ],
          correctAnswer: "Departments with more than 5 employees",
          explanation: "HAVING clause filters groups after aggregation, showing only departments with more than 5 employees.",
          concept: "SQL GROUP BY and HAVING clauses"
        }
      ]
    },
    operatingSystems: {
      name: "Operating Systems",
      questions: [
        {
          codingId: 16,
          question: "What will be the output of this process scheduling simulation?",
          questionType: "output",
          codeSnippet: `// Round Robin Scheduling with time quantum = 2
let processes = [
    {id: 'P1', burst: 5},
    {id: 'P2', burst: 3},
    {id: 'P3', burst: 4}
];

// Execution order: P1(2) -> P2(2) -> P3(2) -> P1(2) -> P2(1) -> P3(2) -> P1(1)
console.log("Completion order: P2, P3, P1");`,
          options: [
            "P2, P3, P1",
            "P1, P2, P3",
            "P3, P2, P1",
            "P1, P3, P2"
          ],
          correctAnswer: "P2, P3, P1",
          explanation: "With time quantum 2: P1 needs 5 units (3 rounds), P2 needs 3 units (2 rounds), P3 needs 4 units (2 rounds). P2 finishes first, then P3, then P1.",
          concept: "Round Robin CPU scheduling"
        },
        {
          codingId: 17,
          question: "Find the deadlock condition in this code:",
          questionType: "error",
          codeSnippet: `// Process A
lock(resource1);
lock(resource2);
// use resources
unlock(resource2);
unlock(resource1);

// Process B  
lock(resource2);
lock(resource1);
// use resources
unlock(resource1);
unlock(resource2);`,
          options: [
            "Circular wait condition",
            "Missing unlock statements",
            "Incorrect lock order",
            "No deadlock condition"
          ],
          correctAnswer: "Circular wait condition",
          explanation: "Process A waits for resource2 (held by B), Process B waits for resource1 (held by A) - circular wait creates deadlock.",
          concept: "Deadlock detection and prevention"
        },
        {
          codingId: 18,
          question: "What will be the page fault count in this memory access pattern?",
          questionType: "output",
          codeSnippet: `// LRU Page Replacement Algorithm
// Memory frames: 3
// Page reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5

// Initial: [1, 2, 3] - 3 page faults
// Access 4: [1, 2, 4] - 1 page fault (replace 3)
// Access 1: [1, 2, 4] - 0 page faults (hit)
// Access 2: [1, 2, 4] - 0 page faults (hit)
// Access 5: [2, 4, 5] - 1 page fault (replace 1)
// Access 1: [4, 5, 1] - 1 page fault (replace 2)
// Access 2: [5, 1, 2] - 1 page fault (replace 4)
// Access 3: [1, 2, 3] - 1 page fault (replace 5)
// Access 4: [2, 3, 4] - 1 page fault (replace 1)
// Access 5: [3, 4, 5] - 1 page fault (replace 2)

console.log("Total page faults: 9");`,
          options: [
            "9",
            "7",
            "8",
            "10"
          ],
          correctAnswer: "9",
          explanation: "LRU replaces least recently used page. Count includes initial 3 faults plus 6 additional faults.",
          concept: "LRU page replacement algorithm"
        },
        {
          codingId: 19,
          question: "What's wrong with this file system implementation?",
          questionType: "error",
          codeSnippet: `class FileSystem {
    constructor() {
        this.files = new Map();
    }
    
    createFile(name, content) {
        this.files.set(name, content);
    }
    
    readFile(name) {
        return this.files.get(name);
    }
    
    deleteFile(name) {
        this.files.delete(name);
    }
}`,
          options: [
            "No directory structure support",
            "Missing error handling",
            "Incorrect data structure",
            "No error in the code"
          ],
          correctAnswer: "No directory structure support",
          explanation: "Real file systems need hierarchical directory structure, not just flat file storage.",
          concept: "File system design and directory structure"
        },
        {
          codingId: 20,
          question: "What will be the output of this thread synchronization?",
          questionType: "output",
          codeSnippet: `let counter = 0;
let mutex = new Mutex();

async function increment() {
    mutex.lock();
    let temp = counter;
    temp++;
    counter = temp;
    mutex.unlock();
}

// Two threads call increment() simultaneously
// Thread 1: reads counter=0, increments to 1, writes 1
// Thread 2: reads counter=1, increments to 2, writes 2

console.log("Final counter value: 2");`,
          options: [
            "2",
            "1",
            "0",
            "Unpredictable"
          ],
          correctAnswer: "2",
          explanation: "Mutex ensures mutual exclusion. Both threads complete their operations sequentially, resulting in counter = 2.",
          concept: "Thread synchronization and mutex"
        }
      ]
    }
  },
  universities: [
    { value: "bangalore-university", label: "Bangalore University" },
    { value: "visvesvaraya-technological-university", label: "Visvesvaraya Technological University" },
    { value: "karnataka-state-open-university", label: "Karnataka State Open University" },
    { value: "rajiv-gandhi-university", label: "Rajiv Gandhi University of Health Sciences" },
    { value: "karnataka-state-law-university", label: "Karnataka State Law University" },
    { value: "karnataka-state-rural-development", label: "Karnataka State Rural Development and Panchayat Raj University" },
    { value: "other", label: "Other University" }
  ],
  educationTypes: [
    { value: "bsc-cs", label: "BSC – CS" },
    { value: "bca", label: "BCA" },
    { value: "be-cs-is", label: "BE (CS & IS)" },
    { value: "msc-cs", label: "M.SC (CS)" },
    { value: "mca", label: "MCA" },
    { value: "mtech", label: "M. Tech" }
  ],
  expertiseLevels: [
    { expertiseLevelId: 1, levelName: "Beginner" },
    { expertiseLevelId: 2, levelName: "Intermediate" },
    { expertiseLevelId: 3, levelName: "Advanced" },
    { expertiseLevelId: 4, levelName: "Expert" }
  ],
  experienceLevels: [
    { experienceId: 1, experienceName: "0-1 years" },
    { experienceId: 2, experienceName: "1-3 years" },
    { experienceId: 3, experienceName: "3-5 years" },
    { experienceId: 4, experienceName: "5+ years" }
  ]
};

const CodingAcademicPractice = () => {
    const navigate = useNavigate();
    const [isSingleTab, setIsSingleTab] = useState(true);
    const [topicList, setTopicList] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedEducation, setSelectedEducation] = useState("");
    const [expertiseLevels, setExpertiseLevels] = useState([]);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [selectedExpertiseLevel, setSelectedExpertiseLevel] = useState("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const tabIdRef = useRef(Date.now());
    const channelRef = useRef(null);

    const testName = "Coding Academic Practice Session";
    const totalQuestions = 10;
    const selectedMode = "PRACTICE";
    const durationMinutes = 30;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.accessToken
    };

    // Get data from static JSON
    const universities = codingAcademicData.universities;
    const educationTypes = codingAcademicData.educationTypes;

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
        // Load topics from static JSON sections
        const topics = Object.keys(codingAcademicData.sections).map((sectionKey, index) => ({
            topicId: index + 1,
            topicName: codingAcademicData.sections[sectionKey].name
        }));
        setTopicList(topics);
        setExpertiseLevels(codingAcademicData.expertiseLevels);
        setExperienceLevels(codingAcademicData.experienceLevels);
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

        if (!selectedUniversity) {
            Swal.fire("Incomplete", "Please select university", "warning");
            return;
        }

        if (!selectedEducation) {
            Swal.fire("Incomplete", "Please select education type", "warning");
            return;
        }

        if (!selectedExpertiseLevel) {
            Swal.fire("Incomplete", "Please select expertise level", "warning");
            return;
        }

        if (!selectedExperience) {
            Swal.fire("Incomplete", "Please select experience level", "warning");
            return;
        }

        const selectedTopicObj = topicList.find(topic => topic.topicId === selectedTopic);
        if (!selectedTopicObj) {
            Swal.fire("Error", "Invalid topic selected", "error");
            return;
        }

        setIsLoading(true);

        try {
            // Get questions from the selected topic section
            const sectionKeys = Object.keys(codingAcademicData.sections);
            const selectedSectionKey = sectionKeys[selectedTopic - 1];
            const sectionQuestions = codingAcademicData.sections[selectedSectionKey].questions;
            
            // Take first 10 questions from the section (or all if less than 10)
            const selectedQuestions = sectionQuestions.slice(0, 10);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (selectedQuestions && selectedQuestions.length > 0) {
                navigate("/jobs/coding-exam", {
                    state: {
                        codingData: selectedQuestions,
                        selectedTopic: selectedTopicObj,
                        selectedMode,
                        expertiseLevelId: selectedExpertiseLevel,
                        experienceId: selectedExperience,
                        university: selectedUniversity,
                        education: selectedEducation
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
                        Master coding concepts with hands-on practice and real-world problem solving
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
                    {/* Left Panel - Coding Practice Instructions */}
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
                            Coding Practice Instructions
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
                                        Understand the Problem
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
                                        Read the problem statement carefully and identify the requirements
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
                                        Plan Your Approach
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
                                        Think about the algorithm and data structures before coding
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
                                        Write Clean Code
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
                                        Focus on readability, efficiency, and proper error handling
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
                                        Test Your Solution
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
                                        Verify with test cases and optimize for edge cases
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
                            {/* Data Structures & Algorithms Card */}
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
                                    Data Structures & Algorithms
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
                                    Focus on arrays, linked lists, trees, and sorting algorithms
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
                                        88% Match Rate
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
                                    Optimal time: 3-4 sessions per week, 60 minutes each
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

                        {/* University selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>University</InputLabel>
                            <Select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                label="University"
                            >
                                {universities.map((university) => (
                                    <MenuItem key={university.value} value={university.value}>
                                        {university.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Education selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Education</InputLabel>
                            <Select
                                value={selectedEducation}
                                onChange={(e) => setSelectedEducation(e.target.value)}
                                label="Education"
                            >
                                {educationTypes.map((education) => (
                                    <MenuItem key={education.value} value={education.value}>
                                        {education.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Experience Level selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Experience Level</InputLabel>
                            <Select
                                value={selectedExpertiseLevel}
                                onChange={(e) => setSelectedExpertiseLevel(e.target.value)}
                                label="Experience Level"
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

                        {/* Experience selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Experience</InputLabel>
                            <Select
                                value={selectedExperience}
                                onChange={(e) => setSelectedExperience(e.target.value)}
                                label="Experience"
                                disabled={experienceLevels.length === 0}
                            >
                                {experienceLevels.length === 0 ? (
                                    <MenuItem disabled>Loading experience levels...</MenuItem>
                                ) : (
                                    experienceLevels.map((exp) => (
                                        <MenuItem key={exp.experienceId} value={exp.experienceId}>
                                            {exp.experienceName}
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

export default CodingAcademicPractice;
