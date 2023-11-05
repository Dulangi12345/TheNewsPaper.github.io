import React, { createContext, useState, useEffect } from 'react';
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, collection, query, where, addDoc, setDoc, getDocs } from 'firebase/firestore/lite';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    setPersistence(auth, browserLocalPersistence);

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const storedUserRole = localStorage.getItem('userRole');
                try {
                    const userRef = collection(db, "users");
                    const q = query(userRef, where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            if (userData.role === storedUserRole) {
                                setIsLoggedIn(true);
                                setUserRole(storedUserRole);
                            }
                        });
                    } else {
                        console.log("No matching documents found");
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firebase:", error);
                } finally {
                    setIsLoaded(true);
                }
            } else {
                setIsLoggedIn(false);
                setUserRole('');
                setIsLoaded(true);
            }
        });

        return unsubscribe; 
    }, []);
    
    

    const loginAuthContext = async (role) => {
        try {
             // Use JWTs for secure authentication

            // Set the user role in local storage
            await setPersistence(auth, browserLocalPersistence);
            setIsLoggedIn(true);
            setUserRole(role);
            localStorage.setItem('userRole', role); 
        } catch (error) {
            console.error("Error setting browser persistence:", error);
        }
    };

    const logout = async () => {
        try {
             // Implement server-side checks during critical operations

            // Clear user role from local storage
            await auth.signOut();
            setIsLoggedIn(false);
            setUserRole('');
            localStorage.removeItem('userRole');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    const checkUserRole = (requiredRole) => {
        console.log('Required Role:', requiredRole);
        console.log('User Role:', userRole);
    
        if (requiredRole === 'admin' && userRole === 'admin') {
            console.log("User is an admin.");
            return "admin";
        }
        if (requiredRole === 'user' && userRole === 'user') {
            console.log("User is a regular user.");
            return "user";
        }
        if (requiredRole === 'user' && userRole === 'admin') {
            console.log("User is an admin accessing user pages.");
            return "admin";
        }
        console.log("User role check failed.");
        return false;
    };
    
    

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, loginAuthContext, logout, checkUserRole, isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};
