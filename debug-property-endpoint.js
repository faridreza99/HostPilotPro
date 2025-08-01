// Debug script to test property endpoints directly
const fetch = require('node-fetch');

async function testPropertyEndpoint() {
    console.log('Testing property endpoint...');
    
    try {
        // Use the cookie from the file
        const fs = require('fs');
        const cookie = fs.readFileSync('cookies.txt', 'utf8').trim();
        
        console.log('Cookie:', cookie);
        
        // Test GET properties
        const response = await fetch('http://localhost:5000/api/properties', {
            headers: {
                'Cookie': cookie,
                'Cache-Control': 'no-cache'
            }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.raw());
        
        const data = await response.json();
        console.log('Response data type:', typeof data);
        console.log('Response data length:', Array.isArray(data) ? data.length : 'Not array');
        console.log('First item keys:', data[0] ? Object.keys(data[0]) : 'No items');
        
        if (Array.isArray(data) && data.length > 0) {
            console.log('First property:', JSON.stringify(data[0], null, 2));
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testPropertyEndpoint();