# SmartCart Frontend

A React + Vite frontend for the SmartCart customer segmentation tool. This application connects to a FastAPI backend to predict customer segments based on their purchase behavior.

## Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`.

**Note:** Ensure the FastAPI backend is running at `http://127.0.0.1:8000` before making predictions.

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx           # Main component with form and result display
│   ├── App.css           # Styling
│   ├── api.js            # API client for backend calls
│   ├── main.jsx          # React entry point
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json
└── README.md
```

## Features

- **Multi-section form** with logical grouping:
  - About the Customer
  - Purchase Behavior
  - Spending by Category
  - Advanced / Campaign History (collapsible)

- **Client-side validation** for all inputs
- **Real-time error handling** with user-friendly messages
- **Loading state** during API calls with spinner animation
- **Result display** with cluster-specific colors and descriptions
- **Form reset** button to clear all fields
- **Responsive design** that works on laptops and smaller screens
- **Modern UI** with gradients, smooth transitions, and good spacing

## API Integration

The app connects to the backend at `http://127.0.0.1:8000/predict-segment`.

### Request
Sends customer data as JSON:
```json
{
  "Year_Birth": 1985,
  "Education": "Graduation",
  "Marital_Status": "Married",
  ...
}
```

### Response
Receives cluster prediction:
```json
{
  "cluster": 0,
  "label": "Loyal High Spenders",
  "description": "Long tenure, high total spending, strong campaign response rate."
}
```

## Configuration

To change the backend URL, update the `BACKEND_URL` in `src/api.js`:

```javascript
const BACKEND_URL = 'http://your-backend-url:8000';
```

## Styling

The app uses plain CSS with a modern design system:
- **Primary gradient:** Purple to magenta
- **Cluster colors:** Red, Teal, Blue, Orange (one per cluster)
- **Font:** System fonts for optimal performance
- **Spacing:** Consistent 8px grid
- **Transitions:** Smooth 200-300ms animations

## License

MIT
