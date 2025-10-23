import{U as H,r as n,j as t,B as h,P as Y,T as w,D as K,G as o,F as c,h as l,S as u,d as J,az as s}from"./index-So8Y0uMi.js";import{d as V}from"./PlayArrow-fFRiTYJQ.js";import{M as d}from"./MenuItem-CSdFaWhF.js";const i={sections:{dataStructures:{name:"Data Structures",questions:[{codingId:1,question:"What will be the output of this stack implementation?",questionType:"output",codeSnippet:`class Stack {
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
console.log(stack.pop());`,options:["30, 20","20, 10","10, 20","30, 10"],correctAnswer:"30, 20",explanation:"Stack follows LIFO (Last In, First Out). push(10), push(20), push(30). pop() returns 30, pop() returns 20.",concept:"Stack data structure - LIFO principle"},{codingId:2,question:"Find the error in this queue implementation:",questionType:"error",codeSnippet:`class Queue {
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
console.log(queue.dequeue());`,options:["Missing error handling for empty queue","Incorrect dequeue implementation","Missing return statement","No error in the code"],correctAnswer:"Missing error handling for empty queue",explanation:"The dequeue() method should check if queue is empty before calling shift() to avoid returning undefined.",concept:"Queue data structure and error handling"},{codingId:3,question:"What will be the output of this binary tree traversal?",questionType:"output",codeSnippet:`class TreeNode {
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

console.log(inorderTraversal(root));`,options:["[4, 2, 5, 1, 3]","[1, 2, 4, 5, 3]","[4, 5, 2, 3, 1]","[1, 3, 2, 5, 4]"],correctAnswer:"[4, 2, 5, 1, 3]",explanation:"Inorder traversal: Left -> Root -> Right. Traverse left subtree (4, 2, 5), then root (1), then right subtree (3).",concept:"Binary tree inorder traversal"},{codingId:4,question:"What's wrong with this hash table implementation?",questionType:"error",codeSnippet:`class HashTable {
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
}`,options:["No collision handling","Incorrect hash function","Missing size validation","No error in the code"],correctAnswer:"No collision handling",explanation:"The hash function can produce same index for different keys, causing collisions. Need chaining or open addressing.",concept:"Hash table collision handling"},{codingId:5,question:"What will be the output of this linked list operation?",questionType:"output",codeSnippet:`class ListNode {
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
console.log(reversed.val, reversed.next.val, reversed.next.next.val);`,options:["3, 2, 1","1, 2, 3","3, 1, 2","Error"],correctAnswer:"3, 2, 1",explanation:"The function reverses the linked list. Original: 1->2->3, Reversed: 3->2->1.",concept:"Linked list reversal algorithm"}]},algorithms:{name:"Algorithms",questions:[{codingId:6,question:"What will be the output of this sorting algorithm?",questionType:"output",codeSnippet:`function bubbleSort(arr) {
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
console.log(bubbleSort(numbers));`,options:["[11, 12, 22, 25, 34, 64, 90]","[90, 64, 34, 25, 22, 12, 11]","[64, 34, 25, 12, 22, 11, 90]","[12, 11, 22, 25, 34, 64, 90]"],correctAnswer:"[11, 12, 22, 25, 34, 64, 90]",explanation:"Bubble sort repeatedly compares adjacent elements and swaps them if they're in wrong order, resulting in sorted array.",concept:"Bubble sort algorithm"},{codingId:7,question:"Find the issue in this binary search implementation:",questionType:"error",codeSnippet:`function binarySearch(arr, target) {
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
}`,options:["Incorrect right boundary initialization","Missing mid calculation","Wrong comparison logic","No error in the code"],correctAnswer:"Incorrect right boundary initialization",explanation:"Right should be arr.length - 1, not arr.length, to avoid accessing out-of-bounds index.",concept:"Binary search boundary conditions"},{codingId:8,question:"What will be the output of this recursive function?",questionType:"output",codeSnippet:`function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6));`,options:["8","13","21","5"],correctAnswer:"8",explanation:"Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8",concept:"Recursive algorithms and Fibonacci"},{codingId:9,question:"What's wrong with this dynamic programming solution?",questionType:"error",codeSnippet:`function climbStairs(n) {
    if (n <= 2) return n;
    
    let dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`,options:["Missing base case handling","Incorrect array initialization","Wrong recurrence relation","No error in the code"],correctAnswer:"No error in the code",explanation:"This is a correct implementation of the climbing stairs problem using dynamic programming.",concept:"Dynamic programming and memoization"},{codingId:10,question:"What will be the output of this graph traversal?",questionType:"output",codeSnippet:`function dfs(graph, start, visited = new Set()) {
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

dfs(graph, 'A');`,options:["A B D C","A C D B","A B C D","A D B C"],correctAnswer:"A B D C",explanation:"DFS visits A, then B (first neighbor), then D (neighbor of B), then C (neighbor of D).",concept:"Depth-first search (DFS) algorithm"}]},databases:{name:"Database Systems",questions:[{codingId:11,question:"What will be the result of this SQL query?",questionType:"output",codeSnippet:`SELECT name, age 
FROM users 
WHERE age > 25 
ORDER BY age DESC 
LIMIT 3;`,options:["Top 3 oldest users over 25","All users over 25","Top 3 youngest users over 25","Error in query"],correctAnswer:"Top 3 oldest users over 25",explanation:"Query filters users over 25, orders by age descending (oldest first), and limits to 3 results.",concept:"SQL query with WHERE, ORDER BY, and LIMIT"},{codingId:12,question:"Find the issue in this database transaction:",questionType:"error",codeSnippet:`BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- Missing COMMIT or ROLLBACK`,options:["Missing COMMIT statement","No error handling","Incorrect UPDATE syntax","No error in the code"],correctAnswer:"Missing COMMIT statement",explanation:"Transaction must be committed with COMMIT or rolled back with ROLLBACK to make changes permanent.",concept:"Database transaction management"},{codingId:13,question:"What will be the output of this JOIN query?",questionType:"output",codeSnippet:`SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.city = 'New York';`,options:["All users from New York with their orders","Only users from New York who have orders","All orders from New York users","Error in JOIN syntax"],correctAnswer:"All users from New York with their orders",explanation:"LEFT JOIN returns all users from New York, including those without orders (NULL values).",concept:"SQL LEFT JOIN operation"},{codingId:14,question:"What's wrong with this database index creation?",questionType:"error",codeSnippet:`CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_name ON users(name);
CREATE INDEX idx_user_email_name ON users(email, name);`,options:["Redundant indexes","Incorrect syntax","Missing table specification","No error in the code"],correctAnswer:"Redundant indexes",explanation:"The composite index (email, name) can serve queries on email alone, making the single email index redundant.",concept:"Database indexing strategy"},{codingId:15,question:"What will be the result of this aggregation query?",questionType:"output",codeSnippet:`SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;`,options:["Departments with more than 5 employees","All departments with employee count and average salary","Top 5 departments by employee count","Error in GROUP BY clause"],correctAnswer:"Departments with more than 5 employees",explanation:"HAVING clause filters groups after aggregation, showing only departments with more than 5 employees.",concept:"SQL GROUP BY and HAVING clauses"}]},operatingSystems:{name:"Operating Systems",questions:[{codingId:16,question:"What will be the output of this process scheduling simulation?",questionType:"output",codeSnippet:`// Round Robin Scheduling with time quantum = 2
let processes = [
    {id: 'P1', burst: 5},
    {id: 'P2', burst: 3},
    {id: 'P3', burst: 4}
];

// Execution order: P1(2) -> P2(2) -> P3(2) -> P1(2) -> P2(1) -> P3(2) -> P1(1)
console.log("Completion order: P2, P3, P1");`,options:["P2, P3, P1","P1, P2, P3","P3, P2, P1","P1, P3, P2"],correctAnswer:"P2, P3, P1",explanation:"With time quantum 2: P1 needs 5 units (3 rounds), P2 needs 3 units (2 rounds), P3 needs 4 units (2 rounds). P2 finishes first, then P3, then P1.",concept:"Round Robin CPU scheduling"},{codingId:17,question:"Find the deadlock condition in this code:",questionType:"error",codeSnippet:`// Process A
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
unlock(resource2);`,options:["Circular wait condition","Missing unlock statements","Incorrect lock order","No deadlock condition"],correctAnswer:"Circular wait condition",explanation:"Process A waits for resource2 (held by B), Process B waits for resource1 (held by A) - circular wait creates deadlock.",concept:"Deadlock detection and prevention"},{codingId:18,question:"What will be the page fault count in this memory access pattern?",questionType:"output",codeSnippet:`// LRU Page Replacement Algorithm
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

console.log("Total page faults: 9");`,options:["9","7","8","10"],correctAnswer:"9",explanation:"LRU replaces least recently used page. Count includes initial 3 faults plus 6 additional faults.",concept:"LRU page replacement algorithm"},{codingId:19,question:"What's wrong with this file system implementation?",questionType:"error",codeSnippet:`class FileSystem {
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
}`,options:["No directory structure support","Missing error handling","Incorrect data structure","No error in the code"],correctAnswer:"No directory structure support",explanation:"Real file systems need hierarchical directory structure, not just flat file storage.",concept:"File system design and directory structure"},{codingId:20,question:"What will be the output of this thread synchronization?",questionType:"output",codeSnippet:`let counter = 0;
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

console.log("Final counter value: 2");`,options:["2","1","0","Unpredictable"],correctAnswer:"2",explanation:"Mutex ensures mutual exclusion. Both threads complete their operations sequentially, resulting in counter = 2.",concept:"Thread synchronization and mutex"}]}},universities:[{value:"bangalore-university",label:"Bangalore University"},{value:"visvesvaraya-technological-university",label:"Visvesvaraya Technological University"},{value:"karnataka-state-open-university",label:"Karnataka State Open University"},{value:"rajiv-gandhi-university",label:"Rajiv Gandhi University of Health Sciences"},{value:"karnataka-state-law-university",label:"Karnataka State Law University"},{value:"karnataka-state-rural-development",label:"Karnataka State Rural Development and Panchayat Raj University"},{value:"other",label:"Other University"}],educationTypes:[{value:"bsc-cs",label:"BSC – CS"},{value:"bca",label:"BCA"},{value:"be-cs-is",label:"BE (CS & IS)"},{value:"msc-cs",label:"M.SC (CS)"},{value:"mca",label:"MCA"},{value:"mtech",label:"M. Tech"}],expertiseLevels:[{expertiseLevelId:1,levelName:"Beginner"},{expertiseLevelId:2,levelName:"Intermediate"},{expertiseLevelId:3,levelName:"Advanced"},{expertiseLevelId:4,levelName:"Expert"}],experienceLevels:[{experienceId:1,experienceName:"0-1 years"},{experienceId:2,experienceName:"1-3 years"},{experienceId:3,experienceName:"3-5 years"},{experienceId:4,experienceName:"5+ years"}]},te=()=>{const q=H(),[m,N]=n.useState(!0),[I,E]=n.useState([]),[p,k]=n.useState(""),[g,L]=n.useState(""),[f,P]=n.useState(""),[j,C]=n.useState([]),[R,M]=n.useState([]),[x,O]=n.useState(""),[v,B]=n.useState(""),[T,S]=n.useState(!1),y=n.useRef(Date.now()),D=n.useRef(null),F="Coding Academic Assessment",W="PRACTICE",U=30;""+JSON.parse(sessionStorage.getItem("user")).accessToken;const z=i.universities,_=i.educationTypes;n.useEffect(()=>{const e=new BroadcastChannel("exam_channel");return D.current=e,e.postMessage({type:"check",tabId:y.current}),e.onmessage=r=>{const{type:a,tabId:A}=r.data;a==="check"?e.postMessage({type:"active",tabId:y.current}):a==="active"&&A!==y.current&&N(!1)},()=>{e.close()}},[]),n.useEffect(()=>{const e=Object.keys(i.sections).map((r,a)=>({topicId:a+1,topicName:i.sections[r].name}));E(e),C(i.expertiseLevels),M(i.experienceLevels)},[]);const Q=async()=>{if(!m){alert("Another tab is open. Close it before starting.");return}if(!p){s.fire("Incomplete","Please select a topic","warning");return}if(!g){s.fire("Incomplete","Please select university","warning");return}if(!f){s.fire("Incomplete","Please select education type","warning");return}if(!x){s.fire("Incomplete","Please select expertise level","warning");return}if(!v){s.fire("Incomplete","Please select experience level","warning");return}const e=I.find(r=>r.topicId===p);if(!e){s.fire("Error","Invalid topic selected","error");return}S(!0);try{const a=Object.keys(i.sections)[p-1],b=i.sections[a].questions.slice(0,10);await new Promise(G=>setTimeout(G,1e3)),b&&b.length>0?q("/jobs/coding-exam",{state:{codingData:b,selectedTopic:e,selectedMode:W,expertiseLevelId:x,experienceId:v,university:g,education:f}}):s.fire("No Questions","No Coding questions available for selected filters.","info")}catch(r){console.error("Error fetching coding data:",r),s.fire("Error","Failed to load questions. Please try again.","error")}finally{S(!1)}};return t.jsx(h,{sx:{p:3},children:t.jsxs(Y,{elevation:3,sx:{p:4,borderRadius:2},children:[t.jsx(w,{variant:"h4",gutterBottom:!0,align:"center",color:"primary",children:F}),t.jsx(K,{sx:{my:3}}),t.jsxs(o,{container:!0,spacing:3,children:[t.jsx(o,{item:!0,xs:12,md:6,children:t.jsxs(c,{fullWidth:!0,children:[t.jsx(l,{children:"Select Topic"}),t.jsx(u,{value:p,onChange:e=>k(e.target.value),label:"Select Topic",children:I.map(e=>t.jsx(d,{value:e.topicId,children:e.topicName},e.topicId))})]})}),t.jsx(o,{item:!0,xs:12,md:6,children:t.jsxs(c,{fullWidth:!0,children:[t.jsx(l,{children:"University"}),t.jsx(u,{value:g,onChange:e=>L(e.target.value),label:"University",children:z.map(e=>t.jsx(d,{value:e.value,children:e.label},e.value))})]})}),t.jsx(o,{item:!0,xs:12,md:6,children:t.jsxs(c,{fullWidth:!0,children:[t.jsx(l,{children:"Education Type"}),t.jsx(u,{value:f,onChange:e=>P(e.target.value),label:"Education Type",children:_.map(e=>t.jsx(d,{value:e.value,children:e.label},e.value))})]})}),t.jsx(o,{item:!0,xs:12,md:6,children:t.jsxs(c,{fullWidth:!0,children:[t.jsx(l,{children:"Expertise Level"}),t.jsx(u,{value:x,onChange:e=>O(e.target.value),label:"Expertise Level",children:j.map(e=>t.jsx(d,{value:e.expertiseLevelId,children:e.levelName},e.expertiseLevelId))})]})}),t.jsx(o,{item:!0,xs:12,md:6,children:t.jsxs(c,{fullWidth:!0,children:[t.jsx(l,{children:"Experience Level"}),t.jsx(u,{value:v,onChange:e=>B(e.target.value),label:"Experience Level",children:R.map(e=>t.jsx(d,{value:e.experienceId,children:e.experienceName},e.experienceId))})]})}),t.jsx(o,{item:!0,xs:12,md:6,children:t.jsx(h,{sx:{display:"flex",alignItems:"center",height:"100%"},children:t.jsxs(w,{variant:"h6",color:"text.secondary",children:["Duration: ",U," minutes"]})})})]}),t.jsx(h,{sx:{textAlign:"center",mt:4},children:t.jsx(J,{variant:"contained",size:"large",startIcon:t.jsx(V,{}),onClick:Q,disabled:T||!m,sx:{px:4,py:1.5,fontSize:"1.1rem",borderRadius:2},children:T?"Loading...":"Start Coding Assessment"})}),!m&&t.jsx(h,{sx:{textAlign:"center",mt:2},children:t.jsx(w,{color:"error",children:"Another tab is open. Please close it before starting the assessment."})})]})})};export{te as default};
