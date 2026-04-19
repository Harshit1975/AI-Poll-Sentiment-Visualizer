# 📊 AI Poll Sentiment Visualizer

## Overview
The **AI Poll Sentiment Visualizer** is a production-ready, full-stack web application designed to analyze, process, and visually render survey and poll data. It transforms raw responses into interactive, insightful dashboards.

<img width="1885" height="703" alt="Screenshot 2026-04-19 161021" src="https://github.com/user-attachments/assets/ae156c6b-3f53-460f-8e88-9eb086540de6" />

## 🚀 The Problem & Solution
**Problem:** Raw survey data (CSVs, Google Forms exports) is difficult to interpret. Stakeholders struggle to make quick, data-driven decisions when looking at thousands of rows of text.
**Solution:** This project automates the data pipeline. It ingests survey data, cleans it using Pandas, and serves it via a live API to a React-based frontend where it is beautifully visualized.

## ✨ Features
- **Real-Time Data Processing:** FastAPI backend handles rapid continuous requests using background simulated pipelines.
- **Live Trend Deltas (KPIs):** Stock-market style directional trackers (↑/↓) for immediate metrics visibility.
- **AI Sentiment Analysis Widget:** Automated NLP algorithms assigning semantic polarity (`Positive`, `Neutral`, `Negative`) to incoming user text, mapped to interactive Doughnut charts.
- **Real-Time Server Console (Telemetry):** Hacker-styled log window dynamically rendering `[200 OK]` POST requests, payloads, and latency times for transparent network lifecycle visualization.
- **Live Geographical Heatmap:** Real-time data synthesis tracking and distributing user poll clusters geographically (NA, EMEA, APAC).
- **Export Data Snapshot:** Functional professional API allowing zero-downtime state-dump via CSV generation.
- **Interactive Dashboards:** Built with React & Recharts for dynamic visual storytelling.
- **Premium UX/UI Design:** Deep dynamic themes mapped natively utilizing custom CSS classes for an exceptionally luxurious user feel.

## 🛠 Tech Stack
### Frontend
- **React.js (Vite)**
- **Recharts** (Data Visualization)
- **Lucide Icons**
- **Vanilla CSS (Custom Premium Design System)**

### Backend
- **Python 3.x**
- **FastAPI** (REST API)
- **Pandas & NumPy** (Data Cleaning & Aggregation)
- **Uvicorn** (ASGI Server)

---

## 🏃 How to Run the Project Locally

### 1. Backend Setup (Data & API)
Open a terminal in the `backend` folder:
```bash
cd backend
pip install -r requirements.txt

# Generate the synthetic poll dataset
python generate_data.py

# Start the FastAPI server
python main.py
```
*The API will run at http://localhost:8000*

### 2. Frontend Setup (Dashboard)
Open a new terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
*The Dashboard will run at http://localhost:5173* (or the port Vite provides)

---

## 📸 Expected Outputs & Screenshots to Capture (Pro-Tip)
For your portfolio or LinkedIn, be sure to screenshot:
1. The **Dashboard Overview** in Dark Mode (Highlighting the gradient text).
2. The **Time-Series Area Chart** showing your ability to analyze trends.
3. The **Console/Swagger UI** at `http://localhost:8000/docs` to prove backend API competency.

## 🎓 Real-Time Use Cases
- Event or Campaign Feedback Analysis
- Employee Satisfaction Metrics
- Product Market Research Evaluation

*Created as a portfolio project for Data Analysis and Full-Stack Engineering roles.*

<img width="1799" height="730" alt="Screenshot 2026-04-19 161034" src="https://github.com/user-attachments/assets/b55c0d20-b3ce-4ce3-8603-52781a79d834" />

<img width="947" height="646" alt="Screenshot 2026-04-19 161048" src="https://github.com/user-attachments/assets/7a61a3a2-dc8e-44c5-9c5c-740b14dcf133" />


