import './App.css';
import React from 'react'
import { Routes, Route, } from 'react-router-dom'
import Navbar from '../src/main/Navbar/navbar'
// import { ProtectedRoute } from './auth/requireAuth'
import Login from './auth/login'
import Dashboard from './main/Dashboard/dashboard'
import Footer from './main/Footer/footer'
import Project from './main/Projects/'
import Rating from './main/Rating/rating'
import Task from './main/Tasks/tasks'
import Team from './main/Teams/teams'
import NoMatch from './main/404/index'
import { ProtectedRoute } from './components/ProtectedRoute';
import User from './main/User';
import AddUser from './main/User/AddUser';
import ViewUser from './main/User/ViewUser';
import AddProject from './main/Projects/AddProject';
import AllProject from './main/Projects/AllProjects';
import { CheckRole } from './components/checkRole';

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
                    <Footer />
                </ProtectedRoute>}
            />
            <Route
                path='/project'
                // exact={true}
                element={<>  <ProtectedRoute>    <Navbar />    <Project />  </ProtectedRoute></>}>
                <Route path="add" element={<><CheckRole role="SUPER_ADMIN"><AddProject /></CheckRole></>} />
                <Route path="all" element={<AllProject />} />
                {/* <Route path="view/:projectId" element={<ViewUser />} /> */}
            </Route>
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
            <Route
                path='/user'
                // exact={true}
                element={<>  <ProtectedRoute>    <Navbar />    <User />  </ProtectedRoute></>}>
                <Route path="add" element={<><CheckRole role="SUPER_ADMIN"> <AddUser /></CheckRole></>} />
                <Route path="view/:userId" element={<ViewUser />} />
            </Route>
            <Route path='*' element={<NoMatch />} />
        </Routes>
    )
}

export default App;
