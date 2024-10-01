import React, { useEffect, useState } from "react";

const CLIENT_ID =
  "136790540579-ds3o208vk22alt1vffg52pdgvq0ppov4.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

export default function GoogleCalendar() {
  const [gapiReady, setGapiReady] = useState(false); // Track if gapi is ready

  useEffect(() => {
    // Load the Google API script dynamically
    const loadGapiScript = () => {
      const existingScript = document.getElementById("gapi-script");

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.id = "gapi-script"; // Give an ID to the script
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => initializeGapi();
        script.onerror = () => console.error("Failed to load GAPI script");
      } else {
        initializeGapi(); // If the script already exists, initialize GAPI
      }
    };

    const initializeGapi = () => {
      if (window.gapi) {
        window.gapi.load("client:auth2", () => {
          window.gapi.client
            .init({
              clientId: CLIENT_ID,
              scope: SCOPES,
            })
            .then(() => {
              setGapiReady(true); // GAPI is ready
              console.log("GAPI initialized successfully");
            })
            .catch((error) => {
              console.error("Error initializing GAPI:", error);
            });
        });
      } else {
        console.error("GAPI not loaded yet.");
      }
    };

    loadGapiScript();
  }, []);

  const handleAuthClick = () => {
    try {
      if (window.gapi) {
        window.gapi.auth2.getAuthInstance().signIn();
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleSignOutClick = () => {
    try {
      if (window.gapi) {
        window.gapi.auth2.getAuthInstance().signOut();
      }
    } catch (error) {
      console.error("Error during Google Sign-Out:", error);
    }
  };

  const listUpcomingEvents = () => {
    try {
      if (window.gapi) {
        window.gapi.client.calendar.events
          .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          })
          .then((response) => {
            const events = response.result.items;
            console.log("Upcoming events:", events);
          })
          .catch((error) => console.error("Error fetching events:", error));
      }
    } catch (error) {
      console.error("Error listing events:", error);
    }
  };

  return (
    <div>
      {gapiReady ? (
        <>
          <button onClick={handleAuthClick}>Sign in with Google</button>
          <button onClick={handleSignOutClick}>Sign out</button>
          <button onClick={listUpcomingEvents}>List Upcoming Events</button>
        </>
      ) : (
        <p>Loading Google API...</p>
      )}
    </div>
  );
}
