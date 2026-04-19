from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from pydantic import BaseModel

class PollSubmission(BaseModel):
    age: str
    gender: str
    tool: str
    satisfaction: int
    feedback: str

app = FastAPI(title="Poll Results API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import asyncio
import random
from datetime import datetime
import csv
import os

async def simulate_realtime_data():
    age_groups = ['18-24', '25-34', '35-44', '45+']
    genders = ['Male', 'Female', 'Non-Binary']
    tools = ['Python', 'R', 'Excel', 'Tableau', 'Power BI']
    feedbacks = ["Great tool!", "Needs better UI.", "Very useful.", "Basic features are lacking."]
    
    csv_file = "data/poll_data.csv"
    while True:
        await asyncio.sleep(2)
        if os.path.exists(csv_file):
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            age = random.choice(age_groups)
            gender = random.choices(genders, weights=[0.48, 0.48, 0.04])[0]
            tool = random.choice(tools)
            satisfaction = random.choice([3, 4, 5]) if tool in ['Python', 'Power BI'] else random.choice([1, 2, 3, 4, 5])
            feedback = random.choice(feedbacks)
            
            with open(csv_file, 'a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([timestamp, age, gender, tool, satisfaction, feedback])

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_realtime_data())

import hashlib
def load_data():
    try:
        df = pd.read_csv("data/poll_data.csv")
        df['Date'] = pd.to_datetime(df['Timestamp']).dt.date.astype(str)
        
        # Derive stable pseudo-random region
        def get_region(ts):
            regions = ['North America', 'EMEA', 'APAC', 'LATAM']
            return regions[int(hashlib.md5(str(ts).encode()).hexdigest(), 16) % len(regions)]
        if 'Region' not in df.columns:
            df['Region'] = df['Timestamp'].apply(get_region)
            
        # Derive sentiment from satisfaction
        def get_sentiment(sat):
            return 'Positive' if sat >= 4 else ('Neutral' if sat == 3 else 'Negative')
        if 'Sentiment' not in df.columns:
            df['Sentiment'] = df['Satisfaction'].apply(get_sentiment)
            
        return df
    except Exception as e:
        return pd.DataFrame()

@app.post("/api/submit-poll")
def submit_poll(poll: PollSubmission):
    csv_file = "data/poll_data.csv"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(csv_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, poll.age, poll.gender, poll.tool, poll.satisfaction, poll.feedback])
    return {"message": "Poll submitted successfully!"}

@app.get("/api/recent-feedback")
def get_recent_feedback():
    df = load_data()
    if df.empty: return []
    if 'Timestamp' in df.columns:
        recent = df.sort_values(by='Timestamp', ascending=False).head(10)
    else:
        recent = df.tail(10)
    recent = recent.fillna("")
    return recent.to_dict(orient="records")

@app.get("/api/summary")
def get_summary():
    df = load_data()
    if df.empty: return {"error": "Data not found"}
    avg_satisfaction = round(df['Satisfaction'].mean(), 2)
    total_responses = len(df)
    
    # Calculate mock deltas based on recent activity (last 10% of dataset as "recent")
    recent_len = max(1, int(total_responses * 0.05))
    recent_df = df.tail(recent_len)
    
    responses_delta = recent_len
    recent_sat = round(recent_df['Satisfaction'].mean(), 2)
    sat_delta = round(recent_sat - avg_satisfaction, 2)
    
    return {
        "total_responses": total_responses, 
        "total_delta": f"+{responses_delta}",
        "avg_satisfaction": avg_satisfaction,
        "sat_delta": f"{'+' if sat_delta >= 0 else ''}{sat_delta}"
    }

@app.get("/api/tool-preference")
def get_tool_preference():
    df = load_data()
    if df.empty: return {}
    counts = df['Preferred Tool'].value_counts().to_dict()
    return [{"name": k, "value": v} for k, v in counts.items()]

@app.get("/api/satisfaction")
def get_satisfaction_distribution():
    df = load_data()
    if df.empty: return {}
    counts = df['Satisfaction'].value_counts().sort_index().to_dict()
    return [{"rating": str(k), "count": v} for k, v in counts.items()]

@app.get("/api/sentiment")
def get_sentiment():
    df = load_data()
    if df.empty: return []
    counts = df['Sentiment'].value_counts().to_dict()
    return [{"name": k, "value": v} for k, v in counts.items()]

@app.get("/api/region")
def get_region():
    df = load_data()
    if df.empty: return []
    counts = df['Region'].value_counts().to_dict()
    return [{"name": k, "value": v} for k, v in counts.items()]

@app.get("/api/responses-over-time")
def get_responses_over_time():
    df = load_data()
    if df.empty: return {}
    daily = df.groupby('Date').size().reset_index(name='count')
    # Convert properly
    return daily.to_dict(orient="records")

@app.get("/api/demographics")
def get_demographics():
    df = load_data()
    if df.empty: return {}
    age_counts = df['Age Group'].value_counts().to_dict()
    gender_counts = df['Gender'].value_counts().to_dict()
    return {
        "age": [{"name": k, "value": v} for k, v in age_counts.items()],
        "gender": [{"name": k, "value": v} for k, v in gender_counts.items()]
    }

@app.get("/api/export")
def export_data():
    csv_file = "data/poll_data.csv"
    if os.path.exists(csv_file):
        return FileResponse(csv_file, media_type="text/csv", filename="poll_data_snapshot.csv")
    return {"error": "File not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
