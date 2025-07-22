// Client-side AI helper - makes API calls to server endpoints
// OpenAI should be used on server-side for security

export async function generatePropertyDescription(propertyDetails: {
  name: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  location: string;
}) {
  const response = await fetch('/api/ai/generate-property-description', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(propertyDetails),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Property description generation failed (${response.status}): ${errorData.message}`);
  }
  
  const data = await response.json();
  
  if (!data.description) {
    throw new Error('No description returned from AI service');
  }
  
  return data.description;
}

export async function analyzeGuestReview(reviewText: string) {
  const response = await fetch('/api/ai/analyze-review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reviewText }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze review');
  }
  
  return await response.json();
}

export async function generateMaintenanceTaskSuggestion(propertyType: string, lastMaintenanceDate: string) {
  const response = await fetch('/api/ai/maintenance-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ propertyType, lastMaintenanceDate }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate maintenance suggestions');
  }
  
  return await response.json();
}

export async function askAssistant(prompt: string) {
  const response = await fetch('/api/ai/ask-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`AI request failed (${response.status}): ${errorData.message}`);
  }
  
  const data = await response.json();
  console.log('AI response data:', data);
  
  if (!data.response) {
    throw new Error('No response from AI service');
  }
  
  return data.response;
}