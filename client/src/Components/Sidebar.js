import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import { SidebarData } from "./SidebarData"
import { IconContext } from 'react-icons'

import './../App.css';

function Sidebar() {

    const [sidebar, setSidebar] = useState(false)

    //shows or hides the sidebar
    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <IconContext.Provider value={{ color: 'white' }}>
                <div className="navbar">
                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                </div>


                <nav className={sidebar ? 'side-menu active' : 'side-menu'}>
                    <ul className='side-menu-items' onClick={showSidebar}>
                        <li className="sidebar-toggle">
                            <Link to="#" className='menu-bars'>
                                <IoIcons.IoMdClose/>
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.class}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )
}

export default Sidebar
