import { useState, useEffect } from 'react';

/**
 * Custom hook for managing data in database instead of localStorage
 * @param {string} key - Data key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @param {string} userId - User ID for database operations
 * @param {string} type - Type of data ('settings' or 'session')
 * @returns {[any, function]} Current value and setter function
 */
export const useDatabase = (key, initialValue, userId, type = 'settings') => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from database on mount
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = type === 'settings' 
          ? `/api/user-settings/${userId}` 
          : `/api/session-data/${userId}`;
          
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          const value = data[key] !== undefined ? data[key] : initialValue;
          setStoredValue(value);
        } else {
          setStoredValue(initialValue);
        }
      } catch (err) {
        console.error(`Error loading ${type} data for key "${key}":`, err);
        setError(err);
        setStoredValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, userId, type, initialValue]);

  // Save data to database
  const setValue = async (value) => {
    if (!userId) {
      console.warn('No user ID provided, cannot save to database');
      return;
    }

    try {
      setError(null);
      
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update local state immediately
      setStoredValue(valueToStore);
      
      // Get current data from database
      const endpoint = type === 'settings' 
        ? `/api/user-settings/${userId}` 
        : `/api/session-data/${userId}`;
        
      const getResponse = await fetch(endpoint);
      let currentData = {};
      
      if (getResponse.ok) {
        currentData = await getResponse.json();
      }
      
      // Update the specific key
      const updatedData = {
        ...currentData,
        [key]: valueToStore
      };
      
      // Save to database
      const saveEndpoint = type === 'settings' 
        ? '/api/user-settings' 
        : '/api/session-data';
        
      const saveResponse = await fetch(saveEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          [type === 'settings' ? 'settings' : 'session_data']: updatedData
        })
      });
      
      if (!saveResponse.ok) {
        throw new Error(`Failed to save ${type} data`);
      }
      
    } catch (err) {
      console.error(`Error saving ${type} data for key "${key}":`, err);
      setError(err);
    }
  };

  return [storedValue, setValue, loading, error];
};

/**
 * Hook for managing user settings in database
 */
export const useUserSettings = (key, initialValue, userId) => {
  return useDatabase(key, initialValue, userId, 'settings');
};

/**
 * Hook for managing session data in database
 */
export const useSessionData = (key, initialValue, userId) => {
  return useDatabase(key, initialValue, userId, 'session');
};
