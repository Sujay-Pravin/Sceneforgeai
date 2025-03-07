export async function getAISuggestions(prompt: string): Promise<string> {
    try {
      const response = await fetch('http://localhost:2000/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: prompt }),
      });
  
      const data = await response.json();
      return data.response || 'No response from AI';
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Error: Failed to get AI suggestions.';
    }
  }
  