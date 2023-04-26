import React, { useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import { _discoverMore, _discoverMoreTv, _getHindiMovies, _getHindiTv, _getPopular, _getPopularTv, _getRecommendations, _getRecommendationsTv, _getSimilar, _getSimilarTv, _getTopRated, _getTopRatedTv } from '../../utils/api.service'

export default function Cateogory({ tv }) {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const _init = async () => {
        try {
            setLoading(true)
            var res;
            const { cat, page, id } = params
            switch (cat) {
                case 'popular':
                    if (tv) {
                        res = await _getPopularTv(page)
                    } else {
                        res = await _getPopular(page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;

                case 'top':
                    if (tv) {
                        res = await _getTopRatedTv(page)
                    } else {
                        res = await _getTopRated(page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;
                case 'indian':
                    if (tv) {
                        res = await _getHindiTv(page)
                    } else {
                        res = await _getHindiMovies(page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;
                case 'similar':
                    if (tv) {
                        res = await _getSimilarTv(id, page)
                    } else {
                        res = await _getSimilar(id, page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;
                case 'recomended':
                    if (tv) {
                        res = await _getRecommendationsTv(id, page)
                    } else {
                        res = await _getRecommendations(id, page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;
                default:
                    if (tv) {
                        res = await _discoverMoreTv(page)
                    } else {
                        res = await _discoverMore(page)
                    }
                    setData(res?.results)
                    setLoading(false)
                    break;
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    useEffect(() => {
        _init()
        // eslint-disable-next-line
    }, [params])
    return (
        <main>
            <Header tv={tv} />
            <b style={{ display: "block", position: "absolute", top: "80px", left: "5vw" }} className='text-muted '>/{tv ? "tv" : "movie"}/{params?.cat}</b>
            {!loading ? (
                <>
                    <div className='d-flex flex-wrap justify-content-center' style={{ paddingTop: "110px" }}>
                        {
                            data?.map((o, i) => (
                                <Banner item={o} tv={tv} />
                            ))
                        }
                    </div>
                    <div className='p-2 pt-4 d-flex justify-content-center'>
                        <Pagination>
                            <Pagination.Prev />
                            {Number(params?.page) !== 1 && (
                                <Pagination.Item>
                                    <Link to={tv ? `/tv/${params?.cat}/${params.id ? `${params.id}/${Number(params?.page) - 1}` : Number(params?.page) - 1}` : `/movie/${params?.cat}/${params.id ? `${params.id}/${Number(params?.page) - 1}` : Number(params?.page) - 1}`} className='text-decoration-none'>
                                        {Number(params?.page) - 1}</Link>
                                </Pagination.Item>
                            )}
                            <Pagination.Item active={true}>{params?.page}</Pagination.Item>
                            <Pagination.Item>
                                <Link to={tv ? `/tv/${params?.cat}/${params.id ? `${params.id}/${Number(params?.page) + 1}` : Number(params?.page) + 1}` : `/movie/${params?.cat}/${params.id ? `${params.id}/${Number(params?.page) + 1}` : Number(params?.page) + 1}`} className='text-decoration-none'>
                                    {Number(params?.page) + 1}
                                </Link>
                            </Pagination.Item>
                            <Pagination.Next />
                        </Pagination>
                    </div>
                </>
            ) : (<Loading />)}

            <Footer />
        </main>
    )
}
