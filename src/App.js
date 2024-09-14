import React from "react";
import { Container } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./styles/globalStyles.css";
import NotesPage from "./pages/NotesPage";
import MyHome from "./pages/MyHome.js";
import TasksPage from "./pages/TasksPage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ChooseApartment from "./pages/ChooseApartment.js";
import { UserProvider } from "./components/UserContext.js";
//router
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

//layouts
import BarLayout from "./layouts/BarLayout.js";
import EventsPage from "./pages/EventsPage.js";
import Note from "./components/Note.js";

const myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BarLayout />}>
      <Route index element={<Home />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="myHome" element={<MyHome />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="myTasks" element={<TasksPage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="chooseApartment" element={<ChooseApartment />} />
      <Route path="createNote" element={<Note />} />
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
