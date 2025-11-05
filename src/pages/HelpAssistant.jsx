import { useState, useRef, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from "../components/AppNavbar";


export default function HelpAssistant() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm the ICT Directorate Assistant. I'm here to help you with campus IT services, technical support, software access, network issues, and more. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const ictKnowledgeBase = {
    assist: "I can assist you with:\n• Software and application access\n• Network and connectivity issues\n• Campus WiFi setup\n• Password resets\n• Virtual Class setup\n\nWhat specific issue can I help you with?",
    software:
      "We provide access to:\n• Microsoft Office Suite\n• Adobe Creative Cloud\n• Programming tools\n• Antivirus software\n•\nIf you need access to any other software, please visit the IT Help Desk in person.",
    network:
      "For network issues:\n• KSTU WiFi: Connect to 'KSTU-WiFi' network\n• Username: Your student ID\n• Password: Your campus password\n• If issues persist, visit the IT Help Desk\n• Location: MP Block, Underground Floor\n• Hours: 8 AM - 5 PM, Monday-Friday",
    password:
      "Password Reset:\n• Visit: https://student.kstu.edu.gh/login \n• Click 'Forgot Details?'\n• Provide your Student Index number and your Phone Number and Click on Initiate Reset \n• Create a strong password (min 8 characters)\n• If locked out, visit IT Help Desk in person",
    wifi: "Campus WiFi Setup:\n1. Select 'KSTU WiFi' network\n2. Enter your Virtual class Email and Password\n3. You're connected!",
    vclass: 
      "Virtual Class Setup:\n• Visit: https://vclass.kstu.edu.gh/ \n• Enter your Student email address and your Password\n• Click on 'Log in'\n• If locked out, visit IT Help Desk in person",
    helpdesk:
      "IT Help Desk:\n• Location: MP Block, Underground Floor\n• Email: info.ict@kstu.edu.gh\n• Hours: 8 AM - 5 PM (Mon-Fri)\n•",
    hours:
      "ICT Directorate Hours:\n• Monday - Friday: 8:00 AM - 5:00 PM\n• Saturday: 10:00 AM - 2:00 PM\n• Sunday: Closed\n• Holidays: Closed\n• Emergency support available 24/7 for critical issues",
    default:
      "I can help you with ICT services! Try asking about:\n• Software access\n• Network/WiFi issues\n• Password resets\n• Virtual Class setup\n• Help Desk location and hours\n\nWhat would you like to know?",
  }

  
  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [keyword, response] of Object.entries(ictKnowledgeBase)) {
      if (keyword === "default") continue
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }

    // Check for common phrases
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! How can I assist you with ICT services today?"
    }

    if (lowerMessage.includes("virtual")) {
      return ictKnowledgeBase.vclass
    }

    if (lowerMessage.includes("desk")) {
      return ictKnowledgeBase.helpdesk
    }

    if (lowerMessage.includes("hour") || lowerMessage.includes("time") || lowerMessage.includes("work"))  {
      return ictKnowledgeBase.hours
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("okay")) {
      return "You're welcome! Is there anything else I can help you with?"
    }

    if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return "Goodbye! Feel free to reach out anytime you need ICT support."
    }

    return ictKnowledgeBase.default
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setLoading(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setLoading(false)
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <AppNavbar />

      <main className="container py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-primary mb-2">
            <i className="fas fa-robot me-2"></i>
            ICT Help Assistant
          </h1>
          <p className="text-muted">Get instant help with campus IT services and technical support</p>
        </div>

        {/* Chat Container */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white border-bottom">
            <h5 className="card-title mb-0 text-primary">
              <i className="fas fa-comments me-2"></i>
              Chat Assistant
            </h5>
          </div>
          
          {/* Messages Area */}
          <div 
            className="card-body p-0" 
            style={{ 
              height: "400px", 
              overflowY: "auto",
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
            }}
          >
            <div className="p-3">
              {messages.map((message) => (
                <div key={message.id} className={`d-flex mb-3 ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                  <div
                    className={`rounded p-3 position-relative ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-white border text-dark"
                    }`}
                    style={{ 
                      maxWidth: "70%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  >
                    <p className="mb-1" style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                      {message.text}
                    </p>
                    <small className={`opacity-75 ${message.sender === "user" ? "text-light" : "text-muted"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </small>
                    
                    {/* Chat bubble arrow */}
                    <div
                      className={`position-absolute top-0 ${
                        message.sender === "user"
                          ? "end-0 translate-x-100 border-left-0 border-bottom-0"
                          : "start-0 translate-x-n100 border-right-0 border-bottom-0"
                      }`}
                      style={{
                        width: "0",
                        height: "0",
                        border: "8px solid transparent",
                        borderTopColor: message.sender === "user" ? "#0d6efd" : "#fff",
                        borderRightColor: message.sender === "user" ? "#0d6efd" : "#fff",
                        transform: message.sender === "user" 
                          ? "translateX(100%) rotate(90deg)" 
                          : "translateX(-100%) rotate(-90deg)",
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white border rounded p-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="text-muted">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="card-footer bg-light">
            <div className="input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about software, network, virtual class, or other IT services..."
                className="form-control"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="btn btn-primary"
                type="button"
              >
                <i className="fas fa-paper-plane me-1"></i>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card h-100 border-primary">
              <div className="card-header bg-primary text-white">
                <h6 className="card-title mb-0">
                  <i className="fas fa-question-circle me-2"></i>
                  Common Questions
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">
                    <i className="fas fa-chevron-right text-primary me-2 small"></i>
                    How do I access virtual class?
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-chevron-right text-primary me-2 small"></i>
                    How do I connect to campus WiFi?
                  </li>
                  <li className="mb-1">
                    <i className="fas fa-chevron-right text-primary me-2 small"></i>
                    How do I reset my password?
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-success">
              <div className="card-header bg-success text-white">
                <h6 className="card-title mb-0">
                  <i className="fas fa-life-ring me-2"></i>
                  Need More Help?
                </h6>
              </div>
              <div className="card-body">
                <p className="card-text small mb-2">Visit the IT Help Desk:</p>
                <div className="small">
                  <p className="mb-1">
                    <strong>
                      <i className="fas fa-map-marker-alt text-success me-2"></i>
                      Location:
                    </strong> ICT Building, Ground Floor
                  </p>
                  <p className="mb-1">
                    <strong>
                      <i className="fas fa-clock text-success me-2"></i>
                      Hours:
                    </strong> 8 AM - 5 PM (Mon-Fri)
                  </p>
                  <p className="mb-0">
                    <strong>
                      <i className="fas fa-envelope text-success me-2"></i>
                      Email:
                    </strong> info.ict@kstu.edu.gh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  )
}