import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function Loading() {
    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <Spinner animation="grow" variant='light' />
        </div>
    )
}
