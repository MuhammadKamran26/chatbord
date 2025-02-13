const API_KEY = "Ysk-proj-xF_akxIRgDECFw6LEvYJnNyg6ZHwRggotk4qqfHchK0Nc36hXJtQMHofsHX1zblAUY_9xC9zwZT3BlbkFJwQvWxI6FAYSm7jdy_Y9R0_LnfnPwOpTzom1X7KVlMtFfdnmPU7apjFj7o7Hp_i8tcRcFAcaicA"; // Replace with your OpenAI API Key

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// ✅ Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// ✅ Load Chat History
document.addEventListener("DOMContentLoaded", () => {
    const savedChat = localStorage.getItem("chat-history");
    if (savedChat) {
        chatBox.innerHTML = savedChat;
    }
});

// ✅ Tech Questions and Answers
const techAnswers = {
    "what is ai": "AI (Artificial Intelligence) is the simulation of human intelligence in machines.",
    "what is machine learning": "Machine Learning is a subset of AI that allows systems to learn from data.",
    "what is deep learning": "Deep Learning is a type of ML that uses neural networks with multiple layers.",
    "what is an algorithm": "An algorithm is a step-by-step procedure to solve a problem.",
    "what is programming": "Programming is the process of writing instructions for a computer to execute.",
    "what is javascript": "JavaScript is a programming language used for web development.",
    "what is python": "Python is a high-level programming language known for its simplicity and versatility.",
    "what is cloud computing": "Cloud computing is the delivery of computing services over the internet.",
    "what is blockchain": "Blockchain is a decentralized digital ledger that records transactions securely.",
    "what is cybersecurity": "Cybersecurity is the practice of protecting systems and data from cyber threats.",
    "what is an ip address": "An IP address is a unique identifier for a device on a network.",
    "what is a database": "A database is an organized collection of data for easy access and management.",
    "what is sql": "SQL (Structured Query Language) is used to manage and query databases.",
    "what is nosql": "NoSQL databases store data in flexible, non-tabular structures.",
    "what is a vpn": "A VPN (Virtual Private Network) secures internet connections by encrypting traffic.",
    "what is iot": "IoT (Internet of Things) refers to devices connected to the internet for data exchange.",
    "what is cpu": "A CPU (Central Processing Unit) is the brain of a computer.",
    "what is gpu": "A GPU (Graphics Processing Unit) accelerates graphics rendering.",
    "what is ram": "RAM (Random Access Memory) is temporary storage for fast access by the CPU.",
    "what is ssd": "An SSD (Solid-State Drive) is a faster alternative to HDDs for data storage.",
    "what is lan": "LAN (Local Area Network) is a network within a small area like a home or office.",
    "what is wan": "WAN (Wide Area Network) connects multiple LANs over large distances.",
    "what is a firewall": "A firewall is a security system that monitors and controls network traffic.",
    "what is phishing": "Phishing is a cyberattack that tricks users into revealing sensitive information."
};

// ✅ Function to get Tech Answer
function getTechAnswer(question) {
    let lowerCaseQuestion = question.toLowerCase().trim();
    return techAnswers[lowerCaseQuestion] || null;
}

// ✅ Send Message Function
function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("You", message);
    userInput.value = "";

    let answer = getTechAnswer(message);
    if (answer) {
        appendMessage("AI", answer);
        return;
    }

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
        appendMessage("AI", botReply);
    })
    .catch(error => {
        appendMessage("AI", "Error: Unable to connect to the AI.");
        console.error(error);
    });
}

// ✅ Append Message to Chat
function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}: ${message}</strong>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // ✅ Save to Local Storage
    localStorage.setItem("chat-history", chatBox.innerHTML);
}

// ✅ Send Message on Click
sendBtn.addEventListener("click", sendMessage);

// ✅ Send Message on Enter Key
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// ✅ Voice Input
voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
    };
});
