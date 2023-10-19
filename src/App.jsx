import React, { useState } from 'react'
import './App.css'
import './index.css';
import NavigationLayout from './layout/NavigationLayout'
import AppRoutes from './Routes'

function App() {

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
