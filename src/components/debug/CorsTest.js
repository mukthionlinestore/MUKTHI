import React, { useState } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const CorsTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testCors = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing CORS connection...');
      const response = await axios.get('/api/debug/cors');
      setResult({
        success: true,
        data: response.data,
        message: 'CORS is working correctly! ✅'
      });
      toast.success('CORS test successful!');
    } catch (error) {
      console.error('❌ CORS test failed:', error);
      setResult({
        success: false,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        message: 'CORS test failed ❌'
      });
      toast.error('CORS test failed - Check console for details');
    } finally {
      setTesting(false);
    }
  };

  const testHealth = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('🏥 Testing server health...');
      const response = await axios.get('/api/health');
      setResult({
        success: true,
        data: response.data,
        message: 'Server is healthy! ✅'
      });
      toast.success('Health check successful!');
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setResult({
        success: false,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        message: 'Health check failed ❌'
      });
      toast.error('Health check failed - Check console for details');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#2d3748' }}>🔧 Debug Tools</h4>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={testHealth}
          disabled={testing}
          style={{
            padding: '8px 16px',
            background: '#48bb78',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: testing ? 'not-allowed' : 'pointer',
            opacity: testing ? 0.6 : 1
          }}
        >
          {testing ? '🔄' : '🏥'} Health
        </button>
        
        <button 
          onClick={testCors}
          disabled={testing}
          style={{
            padding: '8px 16px',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: testing ? 'not-allowed' : 'pointer',
            opacity: testing ? 0.6 : 1
          }}
        >
          {testing ? '🔄' : '🧪'} CORS
        </button>
      </div>

      {result && (
        <div style={{
          padding: '12px',
          background: result.success ? '#f0fff4' : '#fed7d7',
          border: `1px solid ${result.success ? '#9ae6b4' : '#feb2b2'}`,
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {result.message}
          </div>
          {result.success ? (
            <pre style={{ 
              background: '#e6fffa', 
              padding: '8px', 
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '150px'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <div style={{ fontSize: '12px', color: '#c53030' }}>
              <div>Error: {result.error}</div>
              {result.code && <div>Code: {result.code}</div>}
              {result.status && <div>Status: {result.status}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CorsTest;
