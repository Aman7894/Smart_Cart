"""
train_and_save.py

Run this ONCE (locally or as the last step of your notebook) to fit the
full SmartCart pipeline and save every object a live API needs.

This is your notebook's exact preprocessing + clustering logic, just
wrapped so nothing gets thrown away after the kernel closes.

IMPORTANT: double-check the column list in FEATURE_COLUMNS / CAT_COLS
against your own df_cleaned / df_encoded.columns before running -
this was reconstructed from your notebook cells, not the raw CSV,
so column names should match but are worth a 10-second sanity check.
"""

import pandas as pd
import joblib

from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score

# ----------------------------------------------------------------------
# 1. Load + clean (same as cells 1-23 in your notebook)
# ----------------------------------------------------------------------
df = pd.read_csv("smartcart_customers.csv")
df["Income"] = df["Income"].fillna(df["Income"].median())

df["Age"] = 2026 - df["Year_Birth"]

df["Dt_Customer"] = pd.to_datetime(df["Dt_Customer"], dayfirst=True)
REFERENCE_DATE = df["Dt_Customer"].max()  # <-- freeze this, save it, reuse it forever
df["Customer_Tenure_Days"] = (REFERENCE_DATE - df["Dt_Customer"]).dt.days

df["Total_Spending"] = (
    df["MntWines"] + df["MntFruits"] + df["MntMeatProducts"]
    + df["MntFishProducts"] + df["MntSweetProducts"] + df["MntGoldProds"]
)
df["Total_Children"] = df["Kidhome"] + df["Teenhome"]

df["Education"] = df["Education"].replace({
    "Basic": "Undergraduate", "2n Cycle": "Undergraduate",
    "Graduation": "Graduate",
    "Master": "Postgraduate", "PhD": "Postgraduate",
})

df["Living_With"] = df["Marital_Status"].replace({
    "Married": "Partner", "Together": "Partner",
    "Single": "Alone", "Divorced": "Alone",
    "Widow": "Alone", "Absurd": "Alone", "YOLO": "Alone",
})

cols_to_drop = [
    "ID", "Year_Birth", "Marital_Status", "Kidhome", "Teenhome", "Dt_Customer",
    "MntWines", "MntFruits", "MntMeatProducts", "MntFishProducts",
    "MntSweetProducts", "MntGoldProds",
]
df_cleaned = df.drop(columns=cols_to_drop)

# outlier removal (same thresholds as your notebook)
df_cleaned = df_cleaned[df_cleaned["Age"] < 90]
df_cleaned = df_cleaned[df_cleaned["Income"] < 600_000]

CAT_COLS = ["Education", "Living_With"]

# ----------------------------------------------------------------------
# 2. Encode (handle_unknown="ignore" so a new customer with a category
#    your encoder has never seen doesn't crash the API)
# ----------------------------------------------------------------------
ohe = OneHotEncoder(handle_unknown="ignore")
enc_cols = ohe.fit_transform(df_cleaned[CAT_COLS])
enc_df = pd.DataFrame(
    enc_cols.toarray(),
    columns=ohe.get_feature_names_out(CAT_COLS),
    index=df_cleaned.index,
)
df_encoded = pd.concat([df_cleaned.drop(columns=CAT_COLS), enc_df], axis=1)

# save the final column order - the API must build rows in this exact order
FEATURE_COLUMNS = df_encoded.columns.tolist()

# ----------------------------------------------------------------------
# 3. Scale + PCA
# ----------------------------------------------------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df_encoded)

pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)

# ----------------------------------------------------------------------
# 4. Cluster
#    KMeans is used for SERVING because it has .predict() for new points.
#    Agglomerative is kept for your notebook's analysis/report only -
#    it has no predict(), so it can't answer for a new customer.
# ----------------------------------------------------------------------
kmeans = KMeans(n_clusters=4, random_state=42)
labels_kmeans = kmeans.fit_predict(X_pca)

agg_clf = AgglomerativeClustering(n_clusters=4, linkage="ward")
labels_agg = agg_clf.fit_predict(X_pca)

print("KMeans silhouette:", silhouette_score(X_pca, labels_kmeans))
print("Agglomerative silhouette:", silhouette_score(X_pca, labels_agg))

# ----------------------------------------------------------------------
# 5. Cluster summary - use this to hand-write persona labels in
#    persona_map.py (mean values per cluster, on the ORIGINAL scale)
# ----------------------------------------------------------------------
df_encoded["cluster"] = labels_kmeans
cluster_summary = df_encoded.groupby("cluster").mean(numeric_only=True)
print("\nCluster summary (use this to name each persona):")
print(cluster_summary)

# ----------------------------------------------------------------------
# 6. Save everything the API needs
# ----------------------------------------------------------------------
joblib.dump(ohe, "artifacts/ohe.pkl")
joblib.dump(scaler, "artifacts/scaler.pkl")
joblib.dump(pca, "artifacts/pca.pkl")
joblib.dump(kmeans, "artifacts/kmeans.pkl")
joblib.dump(FEATURE_COLUMNS, "artifacts/feature_columns.pkl")
joblib.dump(REFERENCE_DATE, "artifacts/reference_date.pkl")
cluster_summary.to_csv("artifacts/cluster_summary.csv")

print("\nSaved all artifacts to ./artifacts/")
