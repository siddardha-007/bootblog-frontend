import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePosts from "./pages/admin/ManagePosts";
import ManageCategories from "./pages/admin/ManageCategories";
import AdminRoute from "./components/AdminRoute";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:postId"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <ManagePosts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
