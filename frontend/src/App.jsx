import { useState } from 'react'
import { predictSegment } from './api'
import './App.css'

export default function App() {
  const [formData, setFormData] = useState({
    Year_Birth: '',
    Education: 'Graduation',
    Marital_Status: 'Single',
    Income: '',
    Kidhome: '0',
    Teenhome: '0',
    Dt_Customer: '',
    Recency: '',
    MntWines: '0',
    MntFruits: '0',
    MntMeatProducts: '0',
    MntFishProducts: '0',
    MntSweetProducts: '0',
    MntGoldProds: '0',
    NumDealsPurchases: '0',
    NumWebPurchases: '0',
    NumCatalogPurchases: '0',
    NumStorePurchases: '0',
    NumWebVisitsMonth: '0',
    AcceptedCmp1: '0',
    AcceptedCmp2: '0',
    AcceptedCmp3: '0',
    AcceptedCmp4: '0',
    AcceptedCmp5: '0',
    Complain: '0',
    Z_CostContact: '3',
    Z_Revenue: '11',
    Response: '0',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandAdvanced, setExpandAdvanced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Required fields
    if (!formData.Year_Birth) return 'Year of birth is required';
    if (!formData.Income) return 'Income is required';
    if (!formData.Dt_Customer) return 'Customer join date is required';
    if (!formData.Recency) return 'Recency (days since last purchase) is required';

    // Numeric validations
    const yearOfBirth = parseInt(formData.Year_Birth, 10);
    const currentYear = new Date().getFullYear();
    if (yearOfBirth < 1900 || yearOfBirth > currentYear) {
      return 'Year of birth must be between 1900 and current year';
    }

    const income = parseFloat(formData.Income);
    if (income < 0) return 'Income cannot be negative';
    if (income === 0) return 'Income must be greater than 0';

    const recency = parseInt(formData.Recency, 10);
    if (recency < 0) return 'Recency cannot be negative';

    // Check for negative spending amounts
    const spendingFields = [
      'MntWines',
      'MntFruits',
      'MntMeatProducts',
      'MntFishProducts',
      'MntSweetProducts',
      'MntGoldProds',
    ];
    for (const field of spendingFields) {
      if (parseFloat(formData[field]) < 0) {
        return `${field} cannot be negative`;
      }
    }

    // Check for negative purchase counts
    const countFields = [
      'NumDealsPurchases',
      'NumWebPurchases',
      'NumCatalogPurchases',
      'NumStorePurchases',
      'NumWebVisitsMonth',
      'Kidhome',
      'Teenhome',
    ];
    for (const field of countFields) {
      if (parseInt(formData[field], 10) < 0) {
        return `${field} cannot be negative`;
      }
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await predictSegment(formData);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      Year_Birth: '',
      Education: 'Graduation',
      Marital_Status: 'Single',
      Income: '',
      Kidhome: '0',
      Teenhome: '0',
      Dt_Customer: '',
      Recency: '',
      MntWines: '0',
      MntFruits: '0',
      MntMeatProducts: '0',
      MntFishProducts: '0',
      MntSweetProducts: '0',
      MntGoldProds: '0',
      NumDealsPurchases: '0',
      NumWebPurchases: '0',
      NumCatalogPurchases: '0',
      NumStorePurchases: '0',
      NumWebVisitsMonth: '0',
      AcceptedCmp1: '0',
      AcceptedCmp2: '0',
      AcceptedCmp3: '0',
      AcceptedCmp4: '0',
      AcceptedCmp5: '0',
      Complain: '0',
      Z_CostContact: '3',
      Z_Revenue: '11',
      Response: '0',
    });
    setResult(null);
    setError('');
  };

  const clusterColors = {
    0: '#FF6B6B', // Red
    1: '#4ECDC4', // Teal
    2: '#45B7D1', // Blue
    3: '#FFA502', // Orange
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🛒 SmartCart</h1>
        <p>Customer Segmentation Tool</p>
      </div>

      <div className="app-content">
        {/* Form Section */}
        <div className="form-section">
          <h2>Analyze Customer Segment</h2>
          <form onSubmit={handleSubmit}>
            {/* About the Customer */}
            <fieldset>
              <legend>About the Customer</legend>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Year_Birth">Year of Birth *</label>
                  <input
                    type="number"
                    id="Year_Birth"
                    name="Year_Birth"
                    value={formData.Year_Birth}
                    onChange={handleInputChange}
                    placeholder="e.g., 1985"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Education">Education Level</label>
                  <select
                    id="Education"
                    name="Education"
                    value={formData.Education}
                    onChange={handleInputChange}
                  >
                    <option value="Basic">Basic</option>
                    <option value="2n Cycle">2n Cycle</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Marital_Status">Marital Status</label>
                  <select
                    id="Marital_Status"
                    name="Marital_Status"
                    value={formData.Marital_Status}
                    onChange={handleInputChange}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Together">Together</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widow">Widow</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Income">Annual Income ($) *</label>
                  <input
                    type="number"
                    id="Income"
                    name="Income"
                    value={formData.Income}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Kidhome">Number of Kids at Home</label>
                  <input
                    type="number"
                    id="Kidhome"
                    name="Kidhome"
                    value={formData.Kidhome}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Teenhome">Number of Teens at Home</label>
                  <input
                    type="number"
                    id="Teenhome"
                    name="Teenhome"
                    value={formData.Teenhome}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="Dt_Customer">Customer Join Date *</label>
                <input
                  type="date"
                  id="Dt_Customer"
                  name="Dt_Customer"
                  value={formData.Dt_Customer}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>

            {/* Purchase Behavior */}
            <fieldset>
              <legend>Purchase Behavior</legend>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Recency">Days Since Last Purchase *</label>
                  <input
                    type="number"
                    id="Recency"
                    name="Recency"
                    value={formData.Recency}
                    onChange={handleInputChange}
                    placeholder="e.g., 45"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="NumDealsPurchases">Purchases with Discount</label>
                  <input
                    type="number"
                    id="NumDealsPurchases"
                    name="NumDealsPurchases"
                    value={formData.NumDealsPurchases}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="NumWebPurchases">Web Purchases</label>
                  <input
                    type="number"
                    id="NumWebPurchases"
                    name="NumWebPurchases"
                    value={formData.NumWebPurchases}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="NumCatalogPurchases">Catalog Purchases</label>
                  <input
                    type="number"
                    id="NumCatalogPurchases"
                    name="NumCatalogPurchases"
                    value={formData.NumCatalogPurchases}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="NumStorePurchases">Store Purchases</label>
                  <input
                    type="number"
                    id="NumStorePurchases"
                    name="NumStorePurchases"
                    value={formData.NumStorePurchases}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="NumWebVisitsMonth">Website Visits per Month</label>
                  <input
                    type="number"
                    id="NumWebVisitsMonth"
                    name="NumWebVisitsMonth"
                    value={formData.NumWebVisitsMonth}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
            </fieldset>

            {/* Spending by Category */}
            <fieldset>
              <legend>Spending by Category ($)</legend>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="MntWines">Wine</label>
                  <input
                    type="number"
                    id="MntWines"
                    name="MntWines"
                    value={formData.MntWines}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="MntFruits">Fruits</label>
                  <input
                    type="number"
                    id="MntFruits"
                    name="MntFruits"
                    value={formData.MntFruits}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="MntMeatProducts">Meat Products</label>
                  <input
                    type="number"
                    id="MntMeatProducts"
                    name="MntMeatProducts"
                    value={formData.MntMeatProducts}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="MntFishProducts">Fish Products</label>
                  <input
                    type="number"
                    id="MntFishProducts"
                    name="MntFishProducts"
                    value={formData.MntFishProducts}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="MntSweetProducts">Sweet Products</label>
                  <input
                    type="number"
                    id="MntSweetProducts"
                    name="MntSweetProducts"
                    value={formData.MntSweetProducts}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="MntGoldProds">Gold Products</label>
                  <input
                    type="number"
                    id="MntGoldProds"
                    name="MntGoldProds"
                    value={formData.MntGoldProds}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                  />
                </div>
              </div>
            </fieldset>

            {/* Advanced / Campaign History (Collapsible) */}
            <fieldset>
              <legend
                className="legend-collapsible"
                onClick={() => setExpandAdvanced(!expandAdvanced)}
              >
                <span className="toggle-arrow">{expandAdvanced ? '▼' : '▶'}</span>
                Advanced / Campaign History
              </legend>
              {expandAdvanced && (
                <div className="advanced-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="AcceptedCmp1">Campaign 1 Accepted</label>
                      <select
                        id="AcceptedCmp1"
                        name="AcceptedCmp1"
                        value={formData.AcceptedCmp1}
                        onChange={handleInputChange}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="AcceptedCmp2">Campaign 2 Accepted</label>
                      <select
                        id="AcceptedCmp2"
                        name="AcceptedCmp2"
                        value={formData.AcceptedCmp2}
                        onChange={handleInputChange}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="AcceptedCmp3">Campaign 3 Accepted</label>
                      <select
                        id="AcceptedCmp3"
                        name="AcceptedCmp3"
                        value={formData.AcceptedCmp3}
                        onChange={handleInputChange}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="AcceptedCmp4">Campaign 4 Accepted</label>
                      <select
                        id="AcceptedCmp4"
                        name="AcceptedCmp4"
                        value={formData.AcceptedCmp4}
                        onChange={handleInputChange}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="AcceptedCmp5">Campaign 5 Accepted</label>
                      <select
                        id="AcceptedCmp5"
                        name="AcceptedCmp5"
                        value={formData.AcceptedCmp5}
                        onChange={handleInputChange}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="Complain">Total Complaints</label>
                      <input
                        type="number"
                        id="Complain"
                        name="Complain"
                        value={formData.Complain}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="Z_CostContact">Contact Cost</label>
                      <input
                        type="number"
                        id="Z_CostContact"
                        name="Z_CostContact"
                        value={formData.Z_CostContact}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Z_Revenue">Expected Revenue</label>
                      <input
                        type="number"
                        id="Z_Revenue"
                        name="Z_Revenue"
                        value={formData.Z_Revenue}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="Response">Last Campaign Response</label>
                    <select
                      id="Response"
                      name="Response"
                      value={formData.Response}
                      onChange={handleInputChange}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>
              )}
            </fieldset>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Form Buttons */}
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Analyzing...
                  </>
                ) : (
                  'Predict Segment'
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {result && (
          <div className="result-section">
            <div
              className="result-card"
              style={{ borderTopColor: clusterColors[result.cluster] }}
            >
              <h2>Customer Segment</h2>
              <div className="result-cluster" style={{ color: clusterColors[result.cluster] }}>
                {result.label}
              </div>
              <div className="result-description">{result.description}</div>
              <div className="result-meta">Cluster #{result.cluster}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
