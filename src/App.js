import './App.css'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar'
import Login from './auth/login'
import Navbar from '../src/main/Navbar/navbar'
import Dashboard from './main/Dashboard/dashboard'
import Project from './main/Projects/'
import Rating from './main/Rating/rating'
import Task from './main/Tasks/tasks'
import Team from './main/Teams/teams'
import NoMatch from './main/404/index'
import { ProtectedRoute } from './components/ProtectedRoute'
import User from './main/User'
import AddUser from './main/User/AddUser'
import ViewUser from './main/User/ViewUser'
import AddProject from './main/Projects/AddProject'
import AllProject from './main/Projects/AllProjects'
import { CheckRole } from './components/checkRole'
import Header from './main/Header'
import UserForm from './main/edit-profile'
import PasswordForm from './setup-password'
import ForgotPassword from './auth/forgotPassword'
import ResetPassword from './auth/resetPassword'
import TeamReport from './main/Team-report'
import { useAuth } from './auth/AuthProvider'
import ViewTask from './main/Rating/View-Rating/viewTask'
import ProjectGrid from './main/Dashboard/projectGrid'
import ViewUserTasks from './main/Rating/View-Rating/viewUserTasks'
import { ToastContainer } from 'react-toastify'

function Layout({ children }) {
  const { userDetails } = useAuth()
  return (
    <>
      <Navbar />
      <Header />
      {children}
    </>
  )
}

function App() {
  return (
    <React.Fragment>
      <ToastContainer autoClose={2000} />
    <ProSidebarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-password/:token" element={<PasswordForm />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard showBtn={true} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/grid"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectGrid showBtn={true} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <Layout>
                <Project />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <CheckRole role={['SUPER_ADMIN', 'ADMIN']}>
                  <AddProject />
                </CheckRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="add/:projectId"
            element={
              <ProtectedRoute>
                <CheckRole role={['SUPER_ADMIN', 'ADMIN']}>
                  <AddProject />
                </CheckRole>
              </ProtectedRoute>
            }
          />

          <Route path="all" element={<AllProject />} />
        </Route>

        <Route
          path="/rating/"
          element={
            <ProtectedRoute>
              <Layout>
                <Rating />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UserForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Layout>
                <Team />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/task"
          exact={true}
          element={
            <ProtectedRoute>
              <Layout>
                <Task />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-report"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamReport />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/:projectId"
          element={
            <ProtectedRoute>
              <Layout>
                <Task />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Layout>
                <User />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <CheckRole role={['SUPER_ADMIN', 'ADMIN']}>
                  <AddUser />
                </CheckRole>
              </ProtectedRoute>
            }
          />

          <Route path="view/:userId" element={<ViewUser />} />
        </Route>

        <Route
          path="/view-user-tasks/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <ViewUserTasks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NoMatch />} />

        <Route
          path="/view-task/:taskId"
          element={
            <ProtectedRoute>
              <Layout>
                <ViewTask />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ProSidebarProvider>
    </React.Fragment>
  )
}

export default App
