import React, { useEffect, useState } from 'react'
import { _getTvImdb } from '../utils/api.service'
import './player.css'
const s = [
    {
        id: 1,
        name: "Gdrive Player",
        url: ""
    },
    {
        id: 2,
        name: "Vidsrc",
        url: ""
    }
]
export default function Player({ data, tv, episode, season }) {
    const [url, setUrl] = useState()
    const findLinks = async () => {
        const urls = ["http://database.gdriveplayer.us/player.php?imdb=", "https://vidsrc.me/embed/"]
        if (tv) {
            const res = await _getTvImdb(data.id)
            s[0].url = urls[0] + res.imdb_id + "&type=series&season=" + season + "&episode=" + episode
            s[1].url = urls[1] + res.imdb_id + "/" + season + "-" + episode
        } else {
            s[0].url = urls[0] + data.imdb_id
            s[1].url = urls[1] + data.imdb_id
        }
        setUrl(s[0].url)
    }


    useEffect(() => {
        findLinks()
        // eslint-disable-next-line
    }, [data])
    return (
        <div>
            <iframe scrolling='no' title={data?.name} className='iframe' allowFullScreen src={url}></iframe>

            <small className='d-block text-warning' style={{ textAlign: "center" }}>If current server do not work try other server below</small>
            <div className='p-2' style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {s.map((o, i) => (
                    <button onClick={() => { setUrl(o.url) }} key={o.id} className="btn text-white m-1" style={url === o.url ? { backgroundColor: "var(--tertiory)" } : { backgroundColor: "var(--secondary)" }}>{o.name}</button>
                ))}
            </div>
        </div>
    )
}
