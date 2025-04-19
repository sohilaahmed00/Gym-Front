import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

export default function MasterLayout() {
  return (
    <>
    <Navbar/>
    {/* <ClassComponent userName={this.state.userName}/> */}
    {/* <FunctionComponent userName={this.state.userName} userAge={this.state.userAge}/> */}
    <div className='text-center container'>
      <Outlet>  </Outlet>
    </div>
    <Footer/>
      </>
  )
}
