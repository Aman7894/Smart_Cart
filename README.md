# 🛒 SmartCart – Customer Segmentation using Machine Learning

SmartCart is a Machine Learning application that predicts customer segments based on demographic information, purchasing behavior, and spending habits. The application helps businesses identify different customer personas, enabling targeted marketing strategies and better customer engagement.

The project integrates a trained ML model with a clean and interactive frontend for real-time customer segment prediction.

---

## 🚀 Features

- 🤖 Machine Learning-based customer segmentation
- 📊 Predict customer persona instantly
- 👤 Analyze demographic information
- 💰 Evaluate customer spending behavior
- 🛍 Analyze purchase history
- ⚡ Real-time predictions
- 🎨 Modern and responsive user interface

---

## 🧠 Technologies Used

### Machine Learning
- Python
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Frontend
- HTML
- CSS
- JavaScript

### Deployment
- Render

---

## 📂 Project Structure

```
Smart_Cart/
│
├── artifacts/                 # Saved ML model and preprocessing files
├── frontend/                  # Frontend source code
│
├── preprocessing.py           # Data preprocessing
├── persona_map.py             # Maps cluster IDs to customer personas
├── main.py                    # Main application
│
├── smartcart_customers.csv    # Dataset
├── requirements.txt           # Python dependencies
├── render.yaml                # Render deployment configuration
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 📊 Input Parameters

The model predicts customer segments using:

- Year of Birth
- Education Level
- Marital Status
- Annual Income
- Number of Kids at Home
- Number of Teens at Home
- Customer Join Date
- Days Since Last Purchase
- Purchases with Discount
- Web Purchases
- Catalog Purchases
- Store Purchases
- Website Visits per Month
- Spending on:
  - Wine
  - Fruits
  - Meat Products
  - Fish Products
  - Sweet Products
  - Gold Products

---

## 🎯 Output

The model classifies customers into meaningful personas such as:

- High-Income Low-Engagement
- Premium Customers
- Budget-Conscious Buyers
- Frequent Online Shoppers
- Loyal Customers

*(The exact personas depend on the trained clustering model.)*

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Aman7894/Smart_Cart.git
```

Move into the project directory

```bash
cd Smart_Cart
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
python main.py
```

---

## 🌐 Deployment

The project is configured for deployment on **Render** using the included `render.yaml` configuration.

---

## 📈 Machine Learning Pipeline

```
Customer Dataset
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Model Training
        │
        ▼
Customer Segmentation
        │
        ▼
Persona Mapping
        │
        ▼
Frontend Prediction
```

---

## 💼 Applications

- Customer Segmentation
- Marketing Campaign Optimization
- Personalized Recommendations
- Customer Analytics
- Business Intelligence
- Customer Retention Strategies

---

## 🔮 Future Enhancements

- Authentication System
- Database Integration
- Analytics Dashboard
- Interactive Charts
- REST API
- Model Retraining Pipeline
- Cloud Storage Integration

---

## 👨‍💻 Author

**Aman Pal**

- GitHub: https://github.com/Aman7894

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!

---

## 📄 License

This project is licensed under the MIT License.
