import React, { useEffect, useState } from 'react'
import { Dropdown, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { _getEpisodes } from '../utils/api.service'
import "./season.css"

export default function SeasonsAndEpisodes({ data, season, episode }) {
    const [episodes, setEpisodes] = useState()
    const [loading, setLoading] = useState(true)
    const [playing, setPlaying] = useState()
    const _init = async () => {
        try {
            setLoading(true)
            const res = await _getEpisodes(data.id, season)
            setEpisodes(res?.episodes);
            setPlaying(res?.episodes?.find(o => o.episode_number.toString() === episode))
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log("season error", error);
        }
    }

    useEffect(() => {
        _init()
        // eslint-disable-next-line
    }, [season])
    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Season ( {data?.number_of_seasons} )
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        data?.seasons?.map((o, i) => (
                            <Link key={i} className="s-link" to={"/tv/play/" + data.id + "/" + o.season_number + "/1"}>
                                {o.name}
                            </Link>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
            <br />
            {!loading ? (
                <>
                    <div className='ep-container'>
                        {
                            episodes?.map((e, i) => (
                                <Link to={"/tv/play/" + data.id + "/" + season + "/" + e.episode_number} key={i} className="ep-link"
                                    style={episode.toString() === e.episode_number?.toString() ? { backgroundColor: "var(--tertiory)" } : {}}
                                >
                                    <small className='d-block' style={episode.toString() === e.episode_number.toString() ? { color: "var(--primary)" } : { color: "silver" }}>Episode {e.episode_number} </small>
                                    <b>{e.name}</b>
                                </Link>
                            ))
                        }
                    </div>
                    <div className='p-2'>
                        <h3 className='text-white'>Season {season} Episode {episode}</h3>
                        <b className='text-white'>{playing?.name}</b>
                        <small className='d-block text-muted'>{playing?.overview}</small>
                        <small className='d-block text-white'>Runtime : {playing?.runtime} min</small>
                    </div>
                </>
            ) : (<Spinner animation='grow' variant="light" className="d-block m-auto" />)}
        </div>
    )
}
