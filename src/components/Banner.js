import React from 'react'
import { Link } from 'react-router-dom'
import { imageUrl } from '../utils/constants'
import "./banner.css"
export default function Banner({ item, index, tv }) {
    return (
        <div>
            <Link to={tv ? "/tv/play/" + item.id + "/1/1" : "/movie/play/" + item.id} state={{ item }} className='banner-img-container' style={index === 0 ? { margin: '5px 5px 5px 5vw' } : { margin: "5px" }}>
                <img src={imageUrl + "w300" + item.poster_path} className="banner-img" alt="logo" />
            </Link>
            <b className='text-white banner-title' style={index === 0 ? { margin: '5px 5px 5px 5vw' } : { margin: "5px" }}>{item.title || item.name}</b>
        </div>
    )
}
