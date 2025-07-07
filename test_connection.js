#!/usr/bin/env node

/**
 * Test script to check frontend-backend connectivity
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5001/api';

async function testConnection() {
    console.log('Testing Memory Lane Backend Connection');
    console.log('=====================================');
    
    try {
        // Test health endpoint
        console.log('\n1. Testing health endpoint...');
        const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        console.log(`   Status: ${healthResponse.status}`);
        const healthData = await healthResponse.text();
        console.log(`   Response: ${healthData}`);
        
        // Test CORS preflight
        console.log('\n2. Testing CORS preflight...');
        const corsResponse = await fetch(`${API_BASE_URL}/auth/check-username`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:8081',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        console.log(`   Status: ${corsResponse.status}`);
        console.log(`   CORS Headers:`, Object.fromEntries(corsResponse.headers.entries()));
        
        // Test actual API call
        console.log('\n3. Testing API call...');
        const apiResponse = await fetch(`${API_BASE_URL}/auth/check-username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8081'
            },
            body: JSON.stringify({ username: 'testuser' })
        });
        console.log(`   Status: ${apiResponse.status}`);
        const apiData = await apiResponse.text();
        console.log(`   Response: ${apiData}`);
        
        console.log('\n✅ All tests passed! Backend is ready for frontend connections.');
        
    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure the backend is running on http://localhost:5001');
        console.log('2. Check that CORS is properly configured');
        console.log('3. Verify the API endpoints are accessible');
        process.exit(1);
    }
}

testConnection(); 