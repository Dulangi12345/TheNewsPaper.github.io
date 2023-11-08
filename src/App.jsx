import React, { useState, useContext } from 'react'
import './App.css'
import './index.css';
import NavigationLayout from './layout/NavigationLayout'
import AppRoutes from './Routes'
import { AuthContext } from './pages/auth/AuthProvider';
import Homepage from './Homepage';

function App() {
    const { isLoggedIn } = useContext(AuthContext);

  return (
      <div>
         <div>
            <NavigationLayout />
            
         </div>
          <div>
              <AppRoutes />
          </div>
      </div>
  )
}

export default App
