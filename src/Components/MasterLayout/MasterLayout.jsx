import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

export default function MasterLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar/>}
      {/* <ClassComponent userName={this.state.userName}/> */}
      {/* <FunctionComponent userName={this.state.userName} userAge={this.state.userAge}/> */}
      <div className='text-center' style={{ width: '100%', padding: 0, marginTop: isAdminRoute ? 0 : 70 }}>
        <Outlet>  </Outlet>
      </div>
      {/* <style>
        {
          `.container{
          margin-top:70px;}`
        }
      </style> */}
      {!isAdminRoute && <Footer/>}
    </>
  )
}
