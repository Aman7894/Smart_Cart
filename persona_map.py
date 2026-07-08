"""
persona_map.py

After running train_and_save.py, open artifacts/cluster_summary.csv
and look at each cluster's average Income, Total_Spending, Age,
Total_Children, Customer_Tenure_Days, Response rate, etc.

Write a short human label + description for each of the 4 clusters
based on what actually stands out. Example structure below - REPLACE
the text with your own read of the numbers, don't ship placeholders.
"""

PERSONA_MAP = {
    0: {
        "label": "High-Income Low-Engagement",
        "description": "High income, below-average spending, rarely responds to campaigns.",
    },
    1: {
        "label": "Budget-Conscious Families",
        "description": "Lower income, more children at home, buys mostly through deals.",
    },
    2: {
        "label": "Loyal High Spenders",
        "description": "Long tenure, high total spending, strong campaign response rate.",
    },
    3: {
        "label": "New & Undecided",
        "description": "Short tenure, moderate spending, hasn't shown a clear pattern yet.",
    },
}
