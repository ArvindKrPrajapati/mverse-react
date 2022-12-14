import React from 'react'
import { logo } from '../utils/constants'
export default function Footer() {
    return (
        <main>
            <hr className='text-muted' />
            <div className='p-5'>
                <img src={logo} alt="logo" className='logo d-block m-auto' />
                <b className='d-block text-muted' style={{ textAlign: "center" }}>
                    We do not store any video on our server , these movies or tv series videos are fetched from third party websites .
                    For any copyright voilation please contact the movie video serving parties
                </b>
                <div className='d-flex justify-content-center p-2'>
                    <a href="https://mverse.epizy.com/download" className='btn text-white' style={{ backgroundColor: "var(--tertiory)" }}>Download Apk</a>
                </div>
            </div>
        </main>
    )
}
