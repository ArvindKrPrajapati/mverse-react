import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import { _search, _searchTv } from '../../utils/api.service'
import { imageUrl } from '../../utils/constants'
export default function Search() {
    const location = useLocation()
    const [tv, setTv] = useState(location?.state?.tv)
    const [searchTerm, setSearchTerm] = useState()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const onChange = async (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length === 0) {
            setData([])
            return
        }
        setLoading(true)
        var res;
        if (tv) {
            res = await _searchTv(e.target.value)
        } else {
            res = await _search(e.target.value)
        }
        setData(res?.results)
        setLoading(false)
    }

    useEffect(() => {
        onChange({ target: { value: searchTerm } })
        // eslint-disable-next-line
    }, [tv])

    return (
        <main className='vh-100 main'>
            <Header tv={tv} focus={true} onChange={onChange} searchTerm={searchTerm} />
            <main className='inside-main'>
                <div className='sticky-header'>
                    <input type="search" className='input d-block d-md-none' placeholder={`search ${tv ? 'tv shows' : 'movies'}`} onChange={(e) => { onChange(e) }} value={searchTerm} />
                </div>
                <div className='d-flex align-items-center text-white'>
                    <label for="movie">Movies</label>&nbsp;&nbsp;
                    <input onChange={() => { setTv(false) }} type="radio" id="movie" className='form-check-input' name='type' checked={!tv} />&nbsp;&nbsp;
                    <label for="tv">Tv</label>&nbsp;&nbsp;
                    <input onChange={() => { setTv(true) }} type="radio" id="tv" className='form-check-input' name='type' checked={tv} />
                </div>
                {searchTerm ?
                    <h4 className='text-white'>Search : {searchTerm}</h4>
                    : <></>
                }
                {!loading ? (
                    <div>
                        {
                            data.map((o, i) => (
                                <Link
                                    to={tv ? "/tv/play/" + o.id + "/1/1" : "/movie/play/" + o.id}
                                    key={i} className="search-result">
                                    <img src={imageUrl + "w300" + o.poster_path} alt="img" className="search-img" />
                                    <div style={{ paddingLeft: "15px" }}>
                                        <h4 className='text-white'>{o.name || o.title}</h4>
                                        <b className='text-white'>{o.release_date || o.first_air_date}</b>
                                        <b className='text-muted overview'> {o?.overview}</b>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                ) : (<Spinner variant='light' animation='grow' style={{ display: "block", margin: "auto", marginTop: "20%" }} />)}
            </main>
        </main>
    )
}
