import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

export default function MasterLayout() {
  return (
    <>
      <Navbar/>
      <div style={{ marginTop: '70px' }}>
        <Outlet />
      </div>
      <Footer/>
    </>
  )
}
