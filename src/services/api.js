const API_URL = 'http://localhost:5000/api/ai';

export const askAI = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend Error:', errorData);
      throw new Error(`Server returned ${response.status}: ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.data; // The backend returns { data: { role: '...', content: '...' } }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
