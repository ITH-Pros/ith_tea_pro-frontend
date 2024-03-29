import './App.css';
import React from 'react'
import { Routes, Route, } from 'react-router-dom'
import AuthProvider, { useAuth } from './auth/AuthProvider';
import Navbar from '../src/main/Navbar/navbar'
// import { ProtectedRoute } from './auth/requireAuth'
import Login from './auth/login'
import Dashboard from './main/Dashboard/dashboard'
import Project from './main/Projects/projects'
import Rating from './main/Rating/rating'
import Task from './main/Tasks/tasks'
import Team from './main/Teams/teams'
import NoMatch from './main/404/index'
import { ProtectedRoute } from './components/ProtectedRoute';

// const LazyAbout = React.lazy(() => import('./components/About'))

function App() {


  return (
    <Routes>
      {
        <Route path='/login' element={
          // <ProtectedRoute>
            <Login />
          // </ProtectedRoute>
        }
        />
      }

      <Route path='/' element={
        <ProtectedRoute>
          <Navbar />
          <Dashboard showBtn={true} />
        </ProtectedRoute>}
      />
      <Route
        path='/project'
        element={
          <ProtectedRoute>
            <Navbar />
            <Project />
          </ProtectedRoute>
        }
      />
      <Route
        path='/rating/'

        element={
          <ProtectedRoute>
            <Navbar />

            <Rating />
          </ProtectedRoute>
        }
      />
      <Route
        path='/team'
        element={
          <ProtectedRoute>
            <Navbar />

            <Team />
          </ProtectedRoute>
        }
      />
      <Route
        path='/task'
        exact={true}
        element={
          <>
            <ProtectedRoute>
              <Navbar />

              <Task />
            </ProtectedRoute>
          </>
        }
      />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  )
}

export default App;
