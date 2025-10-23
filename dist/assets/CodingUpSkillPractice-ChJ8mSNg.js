import{U as J,r as n,j as e,B as c,P as W,T as h,D as z,G as s,F as x,h as m,S as g,d as B,az as r}from"./index-So8Y0uMi.js";import{d as U}from"./PlayArrow-fFRiTYJQ.js";import{M as f}from"./MenuItem-CSdFaWhF.js";const v={topics:[{topicId:1,topicName:"JavaScript Fundamentals"},{topicId:2,topicName:"React.js Concepts"},{topicId:3,topicName:"Node.js & Backend"},{topicId:4,topicName:"Python Programming"},{topicId:5,topicName:"Java Programming"},{topicId:6,topicName:"C++ Programming"},{topicId:7,topicName:"Data Structures"},{topicId:8,topicName:"Algorithms"}],expertiseLevels:[{expertiseLevelId:1,levelName:"Beginner"},{expertiseLevelId:2,levelName:"Intermediate"},{expertiseLevelId:3,levelName:"Advanced"},{expertiseLevelId:4,levelName:"Expert"}],experienceLevels:[{experienceId:1,experienceName:"0-1 years"},{experienceId:2,experienceName:"1-3 years"},{experienceId:3,experienceName:"3-5 years"},{experienceId:4,experienceName:"5+ years"}]},Q=()=>{const S=J(),[a,j]=n.useState(!0),[y,w]=n.useState([]),[l,N]=n.useState(""),[T,E]=n.useState([]),[L,q]=n.useState([]),[d,C]=n.useState(""),[p,A]=n.useState(""),[I,b]=n.useState(!1),u=n.useRef(Date.now()),P=n.useRef(null),F="Coding Up Skills Assessment",R="PRACTICE",k=30;""+JSON.parse(sessionStorage.getItem("user")).accessToken,n.useEffect(()=>{const t=new BroadcastChannel("exam_channel");return P.current=t,t.postMessage({type:"check",tabId:u.current}),t.onmessage=o=>{const{type:i,tabId:M}=o.data;i==="check"?t.postMessage({type:"active",tabId:u.current}):i==="active"&&M!==u.current&&j(!1)},()=>{t.close()}},[]),n.useEffect(()=>{w(v.topics),E(v.expertiseLevels),q(v.experienceLevels)},[]);const D=async()=>{if(!a){alert("Another tab is open. Close it before starting.");return}if(!l){r.fire("Incomplete","Please select a topic","warning");return}if(!d){r.fire("Incomplete","Please select expertise level","warning");return}if(!p){r.fire("Incomplete","Please select experience level","warning");return}const t=y.find(i=>i.topicId===l);if(!t){r.fire("Error","Invalid topic selected","error");return}b(!0);const o=[{codingId:1,question:"What will be the output of this JavaScript code?",questionType:"output",codeSnippet:`let x = 5;
let y = 10;
console.log(x + y);
console.log(x - y);
console.log(x * y);`,options:["15, -5, 50","15, 5, 50","10, -5, 50","15, -5, 45"],correctAnswer:"15, -5, 50",explanation:"The code performs basic arithmetic operations: 5+10=15, 5-10=-5, 5*10=50",concept:"JavaScript arithmetic operators"},{codingId:2,question:"Find the error in this React component:",questionType:"error",codeSnippet:`function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,options:["Missing import statement for useState","Incorrect JSX syntax","Missing return statement","No error in the code"],correctAnswer:"Missing import statement for useState",explanation:"The component uses useState but doesn't import it from React. Should be: import React, { useState } from 'react';",concept:"React hooks and imports"},{codingId:3,question:"What will be the output of this Python code?",questionType:"output",codeSnippet:`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(5))`,options:["5","8","13","21"],correctAnswer:"5",explanation:"The Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5",concept:"Recursion and Fibonacci sequence"},{codingId:4,question:"What's wrong with this Java code?",questionType:"error",codeSnippet:`public class Test {
    public static void main(String[] args) {
        int x = 10;
        int y = 0;
        int result = x / y;
        System.out.println(result);
    }
}`,options:["Division by zero will cause runtime error","Missing semicolon","Incorrect variable declaration","No error in the code"],correctAnswer:"Division by zero will cause runtime error",explanation:"Dividing by zero in Java throws ArithmeticException at runtime. Need to add error handling.",concept:"Exception handling in Java"},{codingId:5,question:"What will be the output of this C++ code?",questionType:"output",codeSnippet:`#include <iostream>
using namespace std;

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    cout << arr[2] << endl;
    cout << *(arr + 3) << endl;
    return 0;
}`,options:["3, 4","2, 3","3, 3","4, 4"],correctAnswer:"3, 4",explanation:"arr[2] accesses the 3rd element (index 2) which is 3. *(arr + 3) is pointer arithmetic accessing the 4th element which is 4.",concept:"Array indexing and pointer arithmetic"},{codingId:6,question:"Find the issue in this Node.js code:",questionType:"error",codeSnippet:`const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log(data);
    }
});

console.log('File reading started');`,options:["Missing error handling","File doesn't exist","Incorrect callback syntax","No error in the code"],correctAnswer:"No error in the code",explanation:"This code is syntactically correct. It reads a file asynchronously and handles both success and error cases properly.",concept:"Node.js asynchronous file operations"},{codingId:7,question:"What will be the output of this JavaScript code?",questionType:"output",codeSnippet:`let arr = [1, 2, 3, 4, 5];
let result = arr.map(x => x * 2).filter(x => x > 5);
console.log(result);`,options:["[6, 8, 10]","[2, 4, 6, 8, 10]","[6, 8]","[8, 10]"],correctAnswer:"[6, 8, 10]",explanation:"map(x => x * 2) doubles each element: [2, 4, 6, 8, 10]. filter(x => x > 5) keeps elements > 5: [6, 8, 10]",concept:"JavaScript array methods (map and filter)"},{codingId:8,question:"What's the problem with this Python code?",questionType:"error",codeSnippet:`def divide_numbers(a, b):
    return a / b

result = divide_numbers(10, 0)
print(result)`,options:["Division by zero error","Missing return statement","Incorrect function definition","No error in the code"],correctAnswer:"Division by zero error",explanation:"Python will raise ZeroDivisionError when dividing by zero. Need to add try-except block for error handling.",concept:"Python exception handling"},{codingId:9,question:"What will be the output of this React code?",questionType:"output",codeSnippet:`function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        setCount(count + 1);
    }, []);
    
    return <div>{count}</div>;
}`,options:["0","1","Infinite loop","Error"],correctAnswer:"1",explanation:"useEffect runs once after initial render (empty dependency array), incrementing count from 0 to 1.",concept:"React useEffect hook"},{codingId:10,question:"What's wrong with this Java code?",questionType:"error",codeSnippet:`public class Test {
    public static void main(String[] args) {
        String str = "Hello";
        str = str + " World";
        System.out.println(str);
    }
}`,options:["String concatenation is inefficient","Missing import statement","Incorrect string declaration","No error in the code"],correctAnswer:"No error in the code",explanation:"This code is syntactically correct. While string concatenation with + creates new objects, it's not an error.",concept:"Java string concatenation"}];try{await new Promise(i=>setTimeout(i,1e3)),o&&o.length>0?S("/jobs/coding-exam",{state:{codingData:o,selectedTopic:t,selectedMode:R,expertiseLevelId:d,experienceId:p}}):r.fire("No Questions","No Coding questions available for selected filters.","info")}catch(i){console.error("Error fetching coding data:",i),r.fire("Error","Failed to load questions. Please try again.","error")}finally{b(!1)}};return e.jsx(c,{sx:{p:3},children:e.jsxs(W,{elevation:3,sx:{p:4,borderRadius:2},children:[e.jsx(h,{variant:"h4",gutterBottom:!0,align:"center",color:"primary",children:F}),e.jsx(z,{sx:{my:3}}),e.jsxs(s,{container:!0,spacing:3,children:[e.jsx(s,{item:!0,xs:12,md:6,children:e.jsxs(x,{fullWidth:!0,children:[e.jsx(m,{children:"Select Topic"}),e.jsx(g,{value:l,onChange:t=>N(t.target.value),label:"Select Topic",children:y.map(t=>e.jsx(f,{value:t.topicId,children:t.topicName},t.topicId))})]})}),e.jsx(s,{item:!0,xs:12,md:6,children:e.jsxs(x,{fullWidth:!0,children:[e.jsx(m,{children:"Expertise Level"}),e.jsx(g,{value:d,onChange:t=>C(t.target.value),label:"Expertise Level",children:T.map(t=>e.jsx(f,{value:t.expertiseLevelId,children:t.levelName},t.expertiseLevelId))})]})}),e.jsx(s,{item:!0,xs:12,md:6,children:e.jsxs(x,{fullWidth:!0,children:[e.jsx(m,{children:"Experience Level"}),e.jsx(g,{value:p,onChange:t=>A(t.target.value),label:"Experience Level",children:L.map(t=>e.jsx(f,{value:t.experienceId,children:t.experienceName},t.experienceId))})]})}),e.jsx(s,{item:!0,xs:12,md:6,children:e.jsx(c,{sx:{display:"flex",alignItems:"center",height:"100%"},children:e.jsxs(h,{variant:"h6",color:"text.secondary",children:["Duration: ",k," minutes"]})})})]}),e.jsx(c,{sx:{textAlign:"center",mt:4},children:e.jsx(B,{variant:"contained",size:"large",startIcon:e.jsx(U,{}),onClick:D,disabled:I||!a,sx:{px:4,py:1.5,fontSize:"1.1rem",borderRadius:2},children:I?"Loading...":"Start Coding Assessment"})}),!a&&e.jsx(c,{sx:{textAlign:"center",mt:2},children:e.jsx(h,{color:"error",children:"Another tab is open. Please close it before starting the assessment."})})]})})};export{Q as default};
