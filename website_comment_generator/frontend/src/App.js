import React, { useState, useEffect } from "react";
import "./App.css";

function GenerationTypeDropdown() {
  const [generationType, setGenerationType] = useState("Comment");
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionClick = (option) => {
    if (option === "Reply") {
      alert("Not available yet");
      return;
    }
    setGenerationType(option);
    setShowOptions(false);
  };

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={handleButtonClick}>
        {generationType}
      </button>
      {showOptions && (
        <div className="dropdown-options">
          <div
            className="dropdown-option"
            onClick={() => handleOptionClick("Comment")}
          >
            Comment
          </div>
          <div
            className="dropdown-option disabled"
            onClick={() => handleOptionClick("Reply")}
          >
            Reply
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  // Generation parameters
  const [temperature, setTemperature] = useState(0.3);
  const [maxNewTokens, setMaxNewTokens] = useState(128);
  const [numReturnSequences, setNumReturnSequences] = useState(1);
  const [topP, setTopP] = useState(1.0);
  const [topK, setTopK] = useState(50);

  // Input things
  const [postText, setPostText] = useState("");
  const [commentPosition, setCommentPosition] = useState(1);
  const [postReactions, setPostReactions] = useState({
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
    "💩": 0,
  });
  const [showPostReactions, setShowPostReactions] = useState(false);
  const [desiredReactions, setDesiredReactions] = useState({
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
    "💩": 0,
  });
  const [showDesiredReactions, setShowDesiredReactions] = useState(false);
  const [notification, setNotification] = useState(null);

  // Output
  const [output, setOutput] = useState(""); // Add this state for output

  // Generation functions
  const handleTemperatureChange = (e) => {
    setTemperature(parseFloat(e.target.value));
  };
  const handleMaxNewTokensChange = (e) => {
    setMaxNewTokens(parseInt(e.target.value));
  };
  const handleNumReturnSequencesChange = (e) => {
    setNumReturnSequences(parseInt(e.target.value));
  };
  const handleTopPChange = (e) => {
    setTopP(parseFloat(e.target.value));
  };
  const handleTopKChange = (e) => {
    setTopK(parseInt(e.target.value));
  };

  // Input functions
  const handlePostTextChange = (e) => {
    setPostText(e.target.value);
    setNotification(null); // Clear notification when user types
  };
  const handleCommentPositionChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      return;
    }
    setCommentPosition(value);
  };
  const handlePostReactionsChange = (e, reaction) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      return;
    }
    const newReactions = { ...postReactions };
    newReactions[reaction] = value;
    setPostReactions(newReactions);
  };
  const handleDesiredReactionsChange = (e, reaction) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      return;
    }
    const newReactions = { ...desiredReactions };
    newReactions[reaction] = value;
    setDesiredReactions(newReactions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!postText.trim()) {
      setNotification({message:"Please write something in the text field before submitting", type:"error"});
      return;
    }
  
    setNotification({message:"Generating...", type:"success"});
  
    try {
      const response = await fetch("https://mccarryster-tg-comment-generator.hf.space/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          generation_params: {
            temperature: temperature,
            max_new_tokens: maxNewTokens,
            num_return_sequences: numReturnSequences,
            top_p: topP,
            top_k: topK,
          },
          comment_data: {
            post_text: postText,
            position: commentPosition,
            post_reactions: postReactions,
            desired_reactions: desiredReactions,
          }
        }),
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOutput(Array.isArray(data.output) ? data.output : [data.output]);
      setNotification(null);
    } catch (error) {
      setNotification({message:"Error generating comment: "+error.message, type:"error"});
    }
  };

  return (
    <div className="generator-container">
      <h1>TG comment generator</h1>
      <div className="sections-container">
        <section className="generation-parameters">
          <h2>Generation Parameters</h2>
          <div className="parameter-field">
            <div className="slider-labels">
              <span>Temperature</span>
              <span className="slider-value">{temperature.toFixed(2)}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={temperature}
                onChange={handleTemperatureChange}
              />
            </div>
          </div>
          <div className="parameter-field">
            <div className="slider-labels"> 
              <span>Max new tokens</span>
              <span className="slider-value">{maxNewTokens}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="100"
                max="500"
                step="5"
                value={maxNewTokens}
                onChange={handleMaxNewTokensChange}
              />
            </div>
          </div>
          <div className="parameter-field">
            <div className="slider-labels">
              <span>Sequences to return</span>
              <span className="slider-value">{numReturnSequences}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={numReturnSequences}
                onChange={handleNumReturnSequencesChange}
              />
            </div>
          </div>
          <div className="parameter-field">
            <div className="slider-labels">
              <span>Top P</span>
              <span className="slider-value">{topP.toFixed(2)}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={topP}
                onChange={handleTopPChange}
              />
            </div>
          </div>
          <div className="parameter-field">
            <div className="slider-labels">
              <span>Top K</span>
              <span className="slider-value">{topK}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={topK}
                onChange={handleTopKChange}
              />
            </div>
          </div>
        </section>

        <section className="input-section">
          <h2>Input</h2>
          <div className="switch-button">
            <label>Generation Type</label>
            <GenerationTypeDropdown />
          </div>
          <div className="textarea-field">
            <textarea
              value={postText}
              onChange={handlePostTextChange}
              placeholder="Post Text"
              className="post-textarea"
            />
          </div>
          <div className="comment-position-field">
            <label>Comment Position</label>
            <input
            type="number"
            value={commentPosition}
            onChange={handleCommentPositionChange}
            onFocus={e => e.target.select()}
            />
          </div>
          <div className="switch-button">
            <label>Post Reactions</label>
            <button
              className="toggle-button"
              onClick={() => setShowPostReactions(!showPostReactions)}
            >
              {showPostReactions ? "Hide" : "Show"}
            </button>
          </div>
          {showPostReactions && (
            <div className="reactions-container">
              {Object.keys(postReactions).map((reaction) => (
                <div key={reaction} className="reaction-input">
                  <label>{reaction}</label>
                  <input
                  type="number"
                  value={postReactions[reaction]}
                  onChange={e => handlePostReactionsChange(e, reaction)}
                  onFocus={e => e.target.select()}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="switch-button">
            <label>Desired Reactions</label>
            <button
              className="toggle-button"
              onClick={() => setShowDesiredReactions(!showDesiredReactions)}
            >
              {showDesiredReactions ? "Hide" : "Show"}
            </button>
          </div>

          {showDesiredReactions && (
            <div className="reactions-container">
              {Object.keys(desiredReactions).map((reaction) => (
                <div key={reaction} className="reaction-input">
                  <label>{reaction}</label>
                  <input
                  type="number"
                  value={desiredReactions[reaction]}
                  onChange={e => handleDesiredReactionsChange(e, reaction)}
                  onFocus={e => e.target.select()}
                  />
                </div>
              ))}
            </div>
          )}
          {notification && (<div className={`notification ${notification.type}`}>{notification.message}</div>)}
          <button
            className="submit-button"
            onClick={handleSubmit}
            // disabled={!postText.trim()} // Disable button if postText is empty or only whitespace
          >
            Generate
          </button>
        </section>

        {/* <section className="output-section">
          <h2>Output</h2>
          <div className="output-list">
            {output.length > 0 ? (
              output.map((comment, index) => (
                <div key={`comment-${index}`} className="comment-item">
                  <div className="comment-header">Option {index + 1}</div>
                  <div className="comment-content">{comment}</div>
                </div>
              ))
            ) : (
              <div className="output-placeholder">Generated comments will appear here</div>
            )}
          </div>
        </section> */}
        <section className="output-section">
          <div className="output-header">
            <h2>Output</h2>
            <span className="disclaimer">LLM can generate comments that are offensive, racist, or politically biased</span>
          </div>
          <div className="output-list">
            {output.length > 0 ? (
              output.map((comment, index) => (
                <div key={`comment-${index}`} className="comment-item">
                  <div className="comment-header">Option {index + 1}</div>
                  <div className="comment-content">{comment}</div>
                </div>
              ))
            ) : (
              <div className="output-placeholder">Generated comments will appear here</div>
            )}
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <p>
          Built by{" "}
          <a
            href="https://github.com/McCarryster"
            target="_blank"
            rel="noopener noreferrer"
          >
            McCarryster
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;