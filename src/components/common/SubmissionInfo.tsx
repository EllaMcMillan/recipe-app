import React from 'react';
const submitLink = import.meta.env.VITE_RECIPE_SUBMIT_FORM_URL;

const SubmissionInfo: React.FC = () => {
  return (
    <div className="submission-info">
      <div className="info-card">
        <h2>Invite Friends to Submit Recipes</h2>
        <p>Share this link with your friends and family so they can send you their favorite recipes!</p>
        
        <div className="form-link-container">
          <label>Shareable Recipe Submission Link:</label>

          <div className="link-box">
            <a href={submitLink} target="_blank" rel="noopener noreferrer">
              Submit a recipe
            </a>
          </div>

          <p className="hint small">
            Share this link with friends so they can submit recipes directly to your app.
          </p>
        </div>

        <div className="instructions-section">
          <h3>How it works:</h3>
          <ol>
            <li>
              <strong>Friends fill out the form</strong>: They only need to provide their name, the recipe title, and paste the full recipe text.
            </li>
            <li>
              <strong>Recipes arrive in your Inbox</strong>: You'll see their submissions in the "Inbox" tab.
            </li>
            <li>
              <strong>Review and Save</strong>: Use the built-in parser to clean up their text and add it to your personal cookbook.
            </li>
          </ol>
        </div>

        <div className="privacy-note">
          <p><em>Note: This process is private. Friends cannot see your existing recipes or meal plans.</em></p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionInfo;
