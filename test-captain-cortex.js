// Simple test to debug Captain Cortex
const fetch = require('node-fetch');

async function testCaptainCortex() {
  try {
    console.log('Testing Captain Cortex...');
    
    const response = await fetch('http://localhost:5173/api/ai-bot/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: "What tasks do we have for tomorrow?"
      })
    });
    
    const data = await response.text();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCaptainCortex();