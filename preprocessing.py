"""
preprocessing.py

The single source of truth for turning ONE raw customer record into the
same feature row your model was trained on. Both train_and_save.py's
logic and main.py's live endpoint must produce identical columns in
identical order - this module is what guarantees that.
"""

import pandas as pd

CAT_COLS = ["Education", "Living_With"]

DROP_COLS = [
    "ID", "Year_Birth", "Marital_Status", "Kidhome", "Teenhome", "Dt_Customer",
    "MntWines", "MntFruits", "MntMeatProducts", "MntFishProducts",
    "MntSweetProducts", "MntGoldProds",
]

EDUCATION_MAP = {
    "Basic": "Undergraduate", "2n Cycle": "Undergraduate",
    "Graduation": "Graduate",
    "Master": "Postgraduate", "PhD": "Postgraduate",
}

LIVING_WITH_MAP = {
    "Married": "Partner", "Together": "Partner",
    "Single": "Alone", "Divorced": "Alone",
    "Widow": "Alone", "Absurd": "Alone", "YOLO": "Alone",
}


def engineer_features(raw: dict, reference_date) -> pd.DataFrame:
    """
    raw: a dict of the RAW fields a frontend form would collect, e.g.
        {
          "ID": 0,                     # dummy value, dropped anyway
          "Year_Birth": 1985,
          "Education": "Graduation",
          "Marital_Status": "Married",
          "Income": 58000,
          "Kidhome": 1,
          "Teenhome": 0,
          "Dt_Customer": "12-03-2013",
          "Recency": 20,
          "MntWines": 350, "MntFruits": 40, "MntMeatProducts": 300,
          "MntFishProducts": 60, "MntSweetProducts": 25, "MntGoldProds": 45,
          "NumDealsPurchases": 3, "NumWebPurchases": 6,
          "NumCatalogPurchases": 2, "NumStorePurchases": 7,
          "NumWebVisitsMonth": 5,
          "AcceptedCmp1": 0, "AcceptedCmp2": 0, "AcceptedCmp3": 0,
          "AcceptedCmp4": 0, "AcceptedCmp5": 0,
          "Complain": 0, "Z_CostContact": 3, "Z_Revenue": 11,
          "Response": 0,
        }
    reference_date: the frozen pandas.Timestamp saved during training
                     (artifacts/reference_date.pkl) - NOT recomputed here.

    Returns a one-row DataFrame with the same engineered columns as
    df_cleaned in the notebook, BEFORE one-hot encoding.
    """
    df = pd.DataFrame([raw])

    df["Age"] = 2026 - df["Year_Birth"]

    df["Dt_Customer"] = pd.to_datetime(df["Dt_Customer"], dayfirst=True)
    df["Customer_Tenure_Days"] = (reference_date - df["Dt_Customer"]).dt.days

    df["Total_Spending"] = (
        df["MntWines"] + df["MntFruits"] + df["MntMeatProducts"]
        + df["MntFishProducts"] + df["MntSweetProducts"] + df["MntGoldProds"]
    )
    df["Total_Children"] = df["Kidhome"] + df["Teenhome"]

    df["Education"] = df["Education"].replace(EDUCATION_MAP)
    df["Living_With"] = df["Marital_Status"].replace(LIVING_WITH_MAP)

    df = df.drop(columns=DROP_COLS)
    return df


def build_model_input(raw: dict, reference_date, ohe, scaler, pca, feature_columns):
    """
    Runs the full chain: raw dict -> engineered features -> one-hot ->
    reindex to training column order -> scale -> PCA.

    Returns the 3-component PCA vector ready for kmeans.predict().
    """
    df = engineer_features(raw, reference_date)

    enc = ohe.transform(df[CAT_COLS])
    enc_df = pd.DataFrame(
        enc.toarray(),
        columns=ohe.get_feature_names_out(CAT_COLS),
        index=df.index,
    )
    df_encoded = pd.concat([df.drop(columns=CAT_COLS), enc_df], axis=1)

    # reindex guarantees the exact same column order/set as training,
    # filling any column the new row didn't produce with 0
    df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

    X_scaled = scaler.transform(df_encoded)
    X_pca = pca.transform(X_scaled)  # transform, never fit_transform
    return X_pca
