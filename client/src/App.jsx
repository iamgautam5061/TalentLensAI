import React from 'react'
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from "./components/Navbar";

import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import UploadResume from './pages/UploadResume';
import CandidateDetails from './pages/CandidateDetails';
import CreateJob from './pages/CreateJob';

import ProtectedLayout from './layout/ProtectedLayout';

const App = () => {

  return (
    <>

      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route element={<ProtectedLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/create-job"
            element={<CreateJob />}
          />

          <Route
            path='/jobs/:jobId'
            element={<JobDetails />}
          />

          <Route
            path="/upload-resume"
            element={<UploadResume />}
          />

          <Route
            path="/candidate/:id"
            element={<CandidateDetails />}
          />

        </Route>

      </Routes>

    </>
  )
}

export default App
