"""
main.py

FastAPI service that answers "which segment is this customer in?" for
a brand-new customer submitted from a frontend form.

Run:
    uvicorn main:app --reload

Then POST to /predict-segment with a JSON body matching CustomerInput.
"""

import subprocess
import sys
import joblib
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from preprocessing import build_model_input
from persona_map import PERSONA_MAP

app = FastAPI(title="SmartCart Segmentation API")
BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"


def ensure_model_artifacts() -> None:
    required_files = [
        ARTIFACTS_DIR / "ohe.pkl",
        ARTIFACTS_DIR / "scaler.pkl",
        ARTIFACTS_DIR / "pca.pkl",
        ARTIFACTS_DIR / "kmeans.pkl",
        ARTIFACTS_DIR / "feature_columns.pkl",
        ARTIFACTS_DIR / "reference_date.pkl",
    ]

    if all(path.exists() for path in required_files):
        return

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [sys.executable, str(BASE_DIR / "train_and_save.py")],
        cwd=BASE_DIR,
        check=True,
    )

    if not all(path.exists() for path in required_files):
        raise RuntimeError("Model artifacts could not be generated after training.")


# allow your React/Vite dev server to call this - tighten origins for prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# Load everything ONCE at startup, not per-request
# ----------------------------------------------------------------------
try:
    ensure_model_artifacts()
    ohe = joblib.load(ARTIFACTS_DIR / "ohe.pkl")
    scaler = joblib.load(ARTIFACTS_DIR / "scaler.pkl")
    pca = joblib.load(ARTIFACTS_DIR / "pca.pkl")
    kmeans = joblib.load(ARTIFACTS_DIR / "kmeans.pkl")
    feature_columns = joblib.load(ARTIFACTS_DIR / "feature_columns.pkl")
    reference_date = joblib.load(ARTIFACTS_DIR / "reference_date.pkl")
except FileNotFoundError:
    raise RuntimeError(
        "Model artifacts not found. Run train_and_save.py first to "
        "generate the ./artifacts/ folder."
    )


class CustomerInput(BaseModel):
    Year_Birth: int
    Education: str          # "Basic" | "2n Cycle" | "Graduation" | "Master" | "PhD"
    Marital_Status: str      # "Single" | "Married" | "Together" | "Divorced" | "Widow"
    Income: float
    Kidhome: int
    Teenhome: int
    Dt_Customer: str         # "DD-MM-YYYY", matches dayfirst=True parsing
    Recency: int
    MntWines: float
    MntFruits: float
    MntMeatProducts: float
    MntFishProducts: float
    MntSweetProducts: float
    MntGoldProds: float
    NumDealsPurchases: int
    NumWebPurchases: int
    NumCatalogPurchases: int
    NumStorePurchases: int
    NumWebVisitsMonth: int
    AcceptedCmp1: int = 0
    AcceptedCmp2: int = 0
    AcceptedCmp3: int = 0
    AcceptedCmp4: int = 0
    AcceptedCmp5: int = 0
    Complain: int = 0
    Z_CostContact: int = 3
    Z_Revenue: int = 11
    Response: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "Year_Birth": 1985,
                "Education": "Graduation",
                "Marital_Status": "Married",
                "Income": 58000,
                "Kidhome": 1,
                "Teenhome": 0,
                "Dt_Customer": "12-03-2013",
                "Recency": 20,
                "MntWines": 350,
                "MntFruits": 40,
                "MntMeatProducts": 300,
                "MntFishProducts": 60,
                "MntSweetProducts": 25,
                "MntGoldProds": 45,
                "NumDealsPurchases": 3,
                "NumWebPurchases": 6,
                "NumCatalogPurchases": 2,
                "NumStorePurchases": 7,
                "NumWebVisitsMonth": 5,
            }
        }


class SegmentResponse(BaseModel):
    cluster: int
    label: str
    description: str


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/predict-segment", response_model=SegmentResponse)
def predict_segment(customer: CustomerInput):
    raw = customer.dict()
    raw["ID"] = 0  # dummy, dropped during feature engineering

    try:
        X_pca_new = build_model_input(
            raw, reference_date, ohe, scaler, pca, feature_columns
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not process input: {e}")

    cluster = int(kmeans.predict(X_pca_new)[0])
    persona = PERSONA_MAP.get(cluster, {"label": "Unknown", "description": ""})

    return SegmentResponse(
        cluster=cluster,
        label=persona["label"],
        description=persona["description"],
    )
