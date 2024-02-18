import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div style={{minHeight: "100vh", backgroundColor: 'white'}}>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Layout
