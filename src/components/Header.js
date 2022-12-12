import React from 'react'
import { Link } from 'react-router-dom'
import { logo } from '../utils/constants'
import "./header.css"
import { BsChevronRight, BsCast } from 'react-icons/bs'
import { BiMoviePlay } from 'react-icons/bi'

export default function Header({ tv }) {
    return (
        <header className='header'>
            <div className='d-flex align-items-center'>
                <Link to="/">
                    <img src={logo} className='logo' alt='logo' />
                </Link>
                <Link className='text-decoration-none text-white d-none d-md-block'>
                    <b>Browse</b>
                    <BsChevronRight />
                </Link>
            </div>
            <div className='d-none d-md-flex align-items-center'>
                <input type="search" className='input d-none d-md-block' placeholder='search movies' />
                <Link to="/" className='header-btn' style={!tv ? { backgroundColor: "var(--tertiory)" } : {}}>
                    <BiMoviePlay />&nbsp;
                    <b>Movies</b>
                </Link>
                <Link to="/tv" className='header-btn' style={tv ? { backgroundColor: "var(--tertiory)" } : {}}>
                    <BsCast />&nbsp;
                    <b>Tv</b>
                </Link>
            </div>
        </header>
    )
}
