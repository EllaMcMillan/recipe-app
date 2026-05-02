import React from 'react';
import type { RecipeSubmission } from '../../types';

interface InboxProps {
  submissions: RecipeSubmission[];
  onReview: (submission: RecipeSubmission) => void;
}

const Inbox: React.FC<InboxProps> = ({ submissions, onReview }) => {
  const formatDate = (submission: RecipeSubmission) => {
    const ts = submission.createdAt || submission.timestamp;
    if (!ts) return 'Unknown date';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="inbox">
      <div className="list-header">
        <h2>Submission Inbox ({submissions.length})</h2>
      </div>

      {submissions.length === 0 ? (
        <p className="empty-state">No new submissions at this time.</p>
      ) : (
        <div className="submission-list">
          {submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <div className="card-header">
                <div>
                  <h3>{submission.recipeName}</h3>
                  <p className="submission-meta">
                    Submitted by <strong>{submission.name}</strong> • {formatDate(submission)}
                  </p>
                </div>
                <button 
                  className="primary" 
                  onClick={() => onReview(submission)}
                >
                  Review Recipe
                </button>
              </div>
              
              <div className="submission-preview">
                <h4>Raw Text Preview:</h4>
                <p>{submission.rawText.substring(0, 200)}...</p>
              </div>
              
              <div className="card-footer">
                <span className="status-tag new">Status: {submission.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
