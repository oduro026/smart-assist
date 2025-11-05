import { Link } from "react-router-dom";

function ChatbotCard() {
  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h6 className="card-title text-muted mb-3">Chatbot</h6>
          <h2 className="fw-bold text-success mb-0 fs-4">Need any help? </h2>
          <p className="text-muted small mb-3">Get answers to your questions</p>
          <Link to="/help" className="btn btn-outline-success btn-sm">
            Let's Chat!
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChatbotCard;