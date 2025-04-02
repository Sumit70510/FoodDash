import React, { useState } from "react";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    console.log({ rating, comment });
    // TODO: Send feedback to backend
    setShowModal(false);
    setRating(0);
    setComment("");
  };

  return (
    <div>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <span className="text-muted mb-0 ps-3">© 2025 FoodDash, Inc</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Give Feedback
        </button>
      </footer>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content text-black">
            <p>Rate your experience:</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: rating >= num ? "gold" : "gray",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Any suggestions?"
              className="form-control bg-white text-black mt-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Styling */}
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
}
