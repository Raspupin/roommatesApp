import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create UserContext
export const UserContext = createContext();

// Create UserProvider to wrap the app and provide the user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to fetch and decode JWT token
  const fetchUserFromToken = () => {
    // Find the JWT token from the cookies
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1]; // Get the token value
      try {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);

        // Set the user context with the decoded token information
        setUser({
          firstName: decodedToken.firstName,
          email: decodedToken.email,
          apartmentId: decodedToken.apartmentId,
          apartmentName: decodedToken.apartmentName,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null); // Reset user if token is invalid
      }
    } else {
      // No token found, reset user to null
      setUser(null);
    }
  };

  useEffect(() => {
    // Fetch the user from the JWT token when the app loads
    fetchUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
