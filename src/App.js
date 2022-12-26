import './App.css';
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider';
import Navbar from '../src/main/Navbar/navbar'
import { RequireAuth } from './auth/requireAuth'
import Login from './auth/login'
import Dashboard from './main/Dashboard/dashboard'
import Project from './main/Projects/projects'
import Rating from './main/Rating/rating'
import Task from './main/Tasks/tasks'
import Team from './main/Teams/teams'
import NoMatch from './main/404/index'
import AddTask from './main/Tasks/add-task';

// const LazyAbout = React.lazy(() => import('./components/About'))

function App() {
  return (
    <AuthProvider>
        
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={
        <RequireAuth>
          <Navbar/>
         <Dashboard showBtn={true} />
         </RequireAuth>} />
        <Route
          path='/project'
          element={
            <RequireAuth>
          <Navbar/>

              <Project />
            </RequireAuth>
          }
        />
        <Route
          path='/rating/'

          element={
            <RequireAuth>
          <Navbar/>

              <Rating />
            </RequireAuth>
          }
        />
        <Route
          path='/team'
          element={
            <RequireAuth>
          <Navbar/>

              <Team />
            </RequireAuth>
          }
        />
        <Route
          path='/task'
          exact={true}
          element={
            <>
            {/* <RequireAuth> */}
          <Navbar/>

              <Task />
             {/* </RequireAuth> */}
            </>
          }
        />
        <Route
          path='/task/add'
          exact={true}
          element={
            <>
            {/* <RequireAuth> */}
          <Navbar/>

              <AddTask />
             {/* </RequireAuth> */}
            </>
          }
        />
       
        {/* <Route path='order-summary' element={<OrderSummary />} />
        <Route path='products' element={<Products />}>
          <Route index element={<FeaturedProducts />} />
          <Route path='featured' element={<FeaturedProducts />} />
          <Route path='new' element={<NewProducts />} />
        </Route> */}
        {/* <Route path='users' element={<Users />}>
          <Route path=':userId' element={<UserDetails />} />
          <Route path='admin' element={<Admin />} />
        </Route> */}

        <Route path='*' element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  )
}

    export default App;
    