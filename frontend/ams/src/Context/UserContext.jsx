// src/Context/UserContext.js
import { createContext, useEffect, useState } from "react";
import api from '../utils/api';

export const DataContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [data, setData] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await api.get("/auth/refetch");
                console.log(response.data);
                setUser(response.data); 
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (token) {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                setData(userData);
            }
            getUser();
        }
    }, [token]);

    return (
        <DataContext.Provider value={{ user, setUser, data, setData, token, setToken }}>
            {children}
        </DataContext.Provider>
    );
}
