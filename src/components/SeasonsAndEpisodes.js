import React, { useEffect, useState } from 'react'
import { Dropdown, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { _getEpisodes } from '../utils/api.service'
import "./season.css"

export default function SeasonsAndEpisodes({ data, season, episode }) {
    const [episodes, setEpisodes] = useState()
    const [loading, setLoading] = useState(true)
    const _init = async () => {
        try {
            setLoading(true)
            const res = await _getEpisodes(data.id, season)
            setEpisodes(res?.episodes);
            console.log(res);
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
            {!loading ? (
                <div className='ep-container'>
                    {
                        episodes?.map((e, i) => (
                            <Link to={"/tv/play/" + data.id + "/" + season + "/" + e.episode_number} key={i} className="ep-link"
                                style={episode === e.episode_number ? { backgroundColor: "var(--tertiory)" } : {}}
                            >
                                <small className='text-muted d-block'>Episode {e.episode_number} </small>
                                <b>{e.name}</b>
                            </Link>
                        ))
                    }
                </div>
            ) : (<Spinner animation='grow' variant="light" className="d-block m-auto" />)}
        </div>
    )
}
