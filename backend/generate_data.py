import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def create_synthetic_data(num_records=500):
    np.random.seed(42)
    random.seed(42)
    
    # Options
    age_groups = ['18-24', '25-34', '35-44', '45+']
    genders = ['Male', 'Female', 'Non-Binary']
    tools = ['Python', 'R', 'Excel', 'Tableau', 'Power BI']
    feedbacks = [
        "Great tool, highly recommended!", 
        "Needs better UI.", 
        "Very useful for my job.", 
        "Steep learning curve.", 
        "Best tool on the market.",
        "Could be faster.",
        "I love the open source community.",
        "Basic features are lacking."
    ]
    
    data = []
    base_date = datetime.now() - timedelta(days=30)
    
    for _ in range(num_records):
        timestamp = base_date + timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))
        age = random.choice(age_groups)
        gender = random.choices(genders, weights=[0.48, 0.48, 0.04])[0]
        tool = random.choice(tools)
        
        # Correlate some satisfaction with tools
        if tool in ['Python', 'Power BI']:
            satisfaction = np.random.choice([3, 4, 5], p=[0.1, 0.4, 0.5])
        elif tool == 'Excel':
            satisfaction = np.random.choice([2, 3, 4, 5], p=[0.1, 0.3, 0.4, 0.2])
        else:
            satisfaction = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.2, 0.4, 0.2, 0.1])
            
        feedback = random.choice(feedbacks) if satisfaction > 2 else random.choice(feedbacks[1::2])
        
        data.append({
            'Timestamp': timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            'Age Group': age,
            'Gender': gender,
            'Preferred Tool': tool,
            'Satisfaction': satisfaction,
            'Feedback': feedback
        })
        
    df = pd.DataFrame(data)
    df.to_csv('data/poll_data.csv', index=False)
    print("Synthetic dataset generated at data/poll_data.csv")

if __name__ == "__main__":
    import os
    os.makedirs('data', exist_ok=True)
    create_synthetic_data()
