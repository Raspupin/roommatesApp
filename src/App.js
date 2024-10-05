import React from "react";
import { Container } from "@mui/material";
import Footer from "./components/Footer";
import "./styles/globalStyles.css";
import { UserProvider } from "./components/UserContext"; // Import UserProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

// Import Pages
import Home from "./pages/Home";
import NotesPage from "./pages/NotesPage";
import MyHome from "./pages/MyHome";
import TasksPage from "./pages/TasksPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChooseApartment from "./pages/ChooseApartment";
import EventsPage from "./pages/EventsPage";
import Note from "./components/Note";

// Import Router
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

// Import Layout
import BarLayout from "./layouts/BarLayout";

const myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BarLayout />}>
      {/* Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="chooseApartment" element={<ChooseApartment />} />

      {/* Protected Routes */}
      <Route
        index
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="notes"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="myHome"
        element={
          <ProtectedRoute>
            <MyHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="myTasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="createNote"
        element={
          <ProtectedRoute>
            <Note />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={myRouter} />
        <Container
          sx={{ position: "relative", zIndex: "1" }}
          style={{ minHeight: "calc(100vh - 64px - 64px)", padding: "2rem" }}
        ></Container>
        <Footer />
      </UserProvider>
    </>
  );
}

export default App;
