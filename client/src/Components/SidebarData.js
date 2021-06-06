import React from 'react'
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs"


// data for each sidebar option
export const SidebarData = [
    {
        title: 'Home',
        path:"/home",
        icon: <AiIcons.AiOutlineHome/>,
        class: 'side-text'
    },
    {
        title: 'Loud vs Quiet',
        path:"/loud",
        icon: <AiIcons.AiOutlineSound/>,
        class: 'side-text'
    },
    {
        title: 'Major or Minor',
        path:"/major",
        icon: <GiIcons.GiMusicalScore/>,
        class: 'side-text'
    },
    {
        title: 'Instrumentalness',
        path:"/inst",
        icon: <GiIcons.GiGuitarHead/>,
        class: 'side-text'
    },
    {
        title: 'SPEED',
        path:"/speed",
        icon: <GiIcons.GiSpeedometer/>,
        class: 'side-text'
    },{
        title: 'ENERGY!!',
        path:"/energy",
        icon: <BsIcons.BsLightning/>,
        class: 'side-text'
    }
]