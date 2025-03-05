import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import Carousal from '../components/Carousal'

export default function Home() {
  return (
    <>
    <div><NavBar/></div>
    <div><Carousal/></div>
    <div className='m-3'><Card img="/img1.jpg"/></div>
    <div className='m-3'><Card img="/img2.jpg"/></div>
    <div className='m-3'><Card img="/img3.jpg"/></div>
    <div><Footer/></div>
    </>
  )
}
