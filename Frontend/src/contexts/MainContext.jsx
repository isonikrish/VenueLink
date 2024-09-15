import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get('http://localhost:9294/api/auth/me', {
                    withCredentials: true,
                });
                if (res.status === 200) {
                    setUser(res.data);
                } else {
                    console.error('Failed to fetch user data:', res.status);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle the error (e.g., setUser(null), show error message)
            }
        }
        getUser();
    }, []);
    
    return (<MainContext.Provider value={{ user}}>
        {children}
    </MainContext.Provider>
    );
};
