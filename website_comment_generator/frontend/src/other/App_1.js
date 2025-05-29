// import React, { useState } from "react";
// import "./App.css";

// const mapReactions = {
//   "👍": 0,
//   "👎": 0,
//   "❤": 0,
//   "🤔": 0,
//   "😢": 0,
//   "😁": 0,
//   "🤣": 0,
//   "🍾": 0,
//   "😡": 0,
//   "🙏": 0,
//   "🔥": 0,
//   "🤡": 0,
//   "🤮": 0,
//   "🖕": 0,
//   "💩": 0,
// };

// function App() {
//   // ... (rest of your code remains the same)
//   const [postText, setPostText] = useState("");
//   const [position, setPosition] = useState(0);
//   const [serverOutput, setServerOutput] = useState("");

//   const [postReactions, setPostReactions] = useState({ ...mapReactions });
//   const [desiredCommentReactions, setDesiredCommentReactions] = useState({
//     ...mapReactions,
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you would typically send data to the server
//     // For demonstration purposes, we'll just update the output
//     setServerOutput(
//       `Received: ${postText}, Post Reactions: ${JSON.stringify(
//         postReactions
//       )}, Position: ${position}, Desired Reactions: ${JSON.stringify(
//         desiredCommentReactions
//       )}`
//     );
//   };

//   const handlePostReactionChange = (reaction, value) => {
//     setPostReactions((prevState) => ({ ...prevState, [reaction]: value }));
//   };

//   const handleDesiredReactionChange = (reaction, value) => {
//     setDesiredCommentReactions((prevState) => ({
//       ...prevState,
//       [reaction]: value,
//     }));
//   };

//   const reactions = Object.keys(mapReactions);
//   const midIndex = Math.ceil(reactions.length / 2);
//   return (
//     <div className="app-container">
//       <header className="header">
//         <h1>Generator</h1>
//       </header>
//       <main className="main-content">
//         <form className="input-form" onSubmit={handleSubmit}>
//           <label>
//             Post Text:
//             <input
//               type="text"
//               value={postText}
//               onChange={(e) => setPostText(e.target.value)}
//             />
//           </label>
//           <div className="reactions-inputs">
//             <h3>Post Reactions:</h3>
//             <div className="reaction-grid">
//               {Object.keys(mapReactions).map((reaction) => (
//                 <label key={reaction} className="reaction-item">
//                   {reaction}
//                   <input
//                     type="number"
//                     value={postReactions[reaction]}
//                     onChange={(e) =>
//                       handlePostReactionChange(reaction, e.target.valueAsNumber)
//                     }
//                   />
//                 </label>
//               ))}
//             </div>
//           </div>
//           <label>
//             Comment Position:
//             <input
//               type="number"
//               value={position}
//               onChange={(e) => setPosition(e.target.valueAsNumber)}
//             />
//           </label>
//           <div className="desired-reactions-inputs">
//             <h3>Desired Comment Reactions:</h3>
//             <div className="reaction-grid">
//               {Object.keys(mapReactions).map((reaction) => (
//                 <label key={reaction} className="reaction-item">
//                   {reaction}
//                   <input
//                     type="number"
//                     value={desiredCommentReactions[reaction]}
//                     onChange={(e) =>
//                       handleDesiredReactionChange(
//                         reaction,
//                         e.target.valueAsNumber
//                       )
//                     }
//                   />
//                 </label>
//               ))}
//             </div>
//           </div>
//           <button type="submit">Submit</button>
//         </form>
//         <div className="output-form">
//           <h2>Server Output</h2>
//           <p>{serverOutput}</p>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import './App.css';

const mapReactions = {
  "👍": 0,
  "👎": 0,
  "❤": 0,
  "🤔": 0,
  "😢": 0,
  "😁": 0,
  "🤣": 0,
  "🍾": 0,
  "😡": 0,
  "🙏": 0,
  "🔥": 0,
  "🤡": 0,
  "🤮": 0,
  "🖕": 0,
  "💩": 0
};

function App() {
  const [postText, setPostText] = useState('');
  const [position, setPosition] = useState(0);
  const [serverOutput, setServerOutput] = useState('');

  const [postReactions, setPostReactions] = useState({ ...mapReactions });
  const [desiredCommentReactions, setDesiredCommentReactions] = useState({ ...mapReactions });

  const [commenterUsername, setCommenterUsername] = useState('');
  const [commentToReply, setCommentToReply] = useState('');
  const [commentHistory, setCommentHistory] = useState([]);
  const [showReplyComponent, setShowReplyComponent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showReplyComponent) {
      // Handle reply generation submission
      const replyData = {
        postText,
        postReactions,
        commenterUsername,
        commentToReply,
        commentHistory
      };
      console.log("Reply Data:", replyData);
      // Here you would typically send data to the server
      // For demonstration purposes, we'll just update the output
      setServerOutput(`Received Reply Data: ${JSON.stringify(replyData)}`);
    } else {
      // Handle comment generation submission
      const commentData = {
        postText,
        postReactions,
        desiredCommentReactions
      };
      console.log("Comment Data:", commentData);
      // Here you would typically send data to the server
      // For demonstration purposes, we'll just update the output
      setServerOutput(`Received Comment Data: ${JSON.stringify(commentData)}`);
    }
  };

  const handlePostReactionChange = (reaction, value) => {
    setPostReactions(prevState => ({ ...prevState, [reaction]: value }));
  };

  const handleDesiredReactionChange = (reaction, value) => {
    setDesiredCommentReactions(prevState => ({ ...prevState, [reaction]: value }));
  };

  const handleSwitchComponent = () => {
    setShowReplyComponent(!showReplyComponent);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Generator</h1>
      </header>
      <main className="main-content">
        <form className="input-form" onSubmit={handleSubmit}>
          <div className="switch-button-container">
            <button type="button" onClick={handleSwitchComponent}>
              Switch to {showReplyComponent ? "Comment" : "Reply"} Generation
            </button>
          </div>
          <label>
            Post Text:
            <input type="text" value={postText} onChange={(e) => setPostText(e.target.value)} />
          </label>
          {showReplyComponent ? (
            <div>
              <label>
                Commenter Username:
                <input type="text" value={commenterUsername} onChange={(e) => setCommenterUsername(e.target.value)} />
              </label>
              <label>
                Comment to Reply:
                <input type="text" value={commentToReply} onChange={(e) => setCommentToReply(e.target.value)} />
              </label>
              <label>
                Comment History (JSON):
                <input type="text" value={JSON.stringify(commentHistory)} onChange={(e) => setCommentHistory(JSON.parse(e.target.value))} />
              </label>
            </div>
          ) : (
            <div>
              <div className="reactions-inputs">
                <h3>Post Reactions:</h3>
                <div className="reaction-grid">
                  {Object.keys(mapReactions).map(reaction => (
                    <label key={reaction} className="reaction-item">
                      {reaction}
                      <input type="number" value={postReactions[reaction]} onChange={(e) => handlePostReactionChange(reaction, e.target.valueAsNumber)} />
                    </label>
                  ))}
                </div>
              </div>
              <div className="desired-reactions-inputs">
                <h3>Desired Comment Reactions:</h3>
                <div className="reaction-grid">
                  {Object.keys(mapReactions).map(reaction => (
                    <label key={reaction} className="reaction-item">
                      {reaction}
                      <input type="number" value={desiredCommentReactions[reaction]} onChange={(e) => handleDesiredReactionChange(reaction, e.target.valueAsNumber)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <label>
            Position:
            <input type="number" value={position} onChange={(e) => setPosition(e.target.valueAsNumber)} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <div className="output-form">
          <h2>Server Output</h2>
          <p>{serverOutput}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
