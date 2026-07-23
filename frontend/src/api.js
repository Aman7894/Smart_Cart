const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Convert a Date object or date string to DD-MM-YYYY format.
 */
function formatDateToDDMMYYYY(date) {
  if (typeof date === 'string') {
    // If it's already a string (e.g., from date input), parse it
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  // If it's a Date object
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Predict customer segment based on form data.
 * @param {Object} formData - The form data object
 * @returns {Promise<Object>} - The API response containing cluster, label, and description
 * @throws {Error} - With a user-friendly error message
 */
export async function predictSegment(formData) {
  try {
    // Prepare payload
    const payload = {
      Year_Birth: parseInt(formData.Year_Birth, 10),
      Education: formData.Education,
      Marital_Status: formData.Marital_Status,
      Income: parseFloat(formData.Income),
      Kidhome: parseInt(formData.Kidhome, 10),
      Teenhome: parseInt(formData.Teenhome, 10),
      Dt_Customer: formatDateToDDMMYYYY(formData.Dt_Customer),
      Recency: parseInt(formData.Recency, 10),
      MntWines: parseFloat(formData.MntWines),
      MntFruits: parseFloat(formData.MntFruits),
      MntMeatProducts: parseFloat(formData.MntMeatProducts),
      MntFishProducts: parseFloat(formData.MntFishProducts),
      MntSweetProducts: parseFloat(formData.MntSweetProducts),
      MntGoldProds: parseFloat(formData.MntGoldProds),
      NumDealsPurchases: parseInt(formData.NumDealsPurchases, 10),
      NumWebPurchases: parseInt(formData.NumWebPurchases, 10),
      NumCatalogPurchases: parseInt(formData.NumCatalogPurchases, 10),
      NumStorePurchases: parseInt(formData.NumStorePurchases, 10),
      NumWebVisitsMonth: parseInt(formData.NumWebVisitsMonth, 10),
      AcceptedCmp1: parseInt(formData.AcceptedCmp1 || 0, 10),
      AcceptedCmp2: parseInt(formData.AcceptedCmp2 || 0, 10),
      AcceptedCmp3: parseInt(formData.AcceptedCmp3 || 0, 10),
      AcceptedCmp4: parseInt(formData.AcceptedCmp4 || 0, 10),
      AcceptedCmp5: parseInt(formData.AcceptedCmp5 || 0, 10),
      Complain: parseInt(formData.Complain || 0, 10),
      Z_CostContact: parseInt(formData.Z_CostContact || 3, 10),
      Z_Revenue: parseInt(formData.Z_Revenue || 11, 10),
      Response: parseInt(formData.Response || 0, 10),
    };

    const response = await fetch(`${BACKEND_URL}/predict-segment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.detail || 'Failed to predict segment. Please check your input.';
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please ensure the backend is running at http://127.0.0.1:8000');
  }
}
