import React, { useEffect, useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { _getPopular, _getTopRated, _getHindiMovies, _getPopularTv, _getTopRatedTv, _getHindiTv } from "../../utils/api.service"
import { imageUrl } from '../../utils/constants';
import "./style.css"
import { BsChevronRight } from 'react-icons/bs'

export default function Home({ tv }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()
    // const [res, setRes] = useState({})
    // const [isTv, setIsTv] = useState(tv)

    const _init = async () => {
        try {
            setLoading(true)
            var popularRes;
            var topRatetRes;
            var hindiRes;
            if (tv) {
                popularRes = await _getPopularTv(1)
                topRatetRes = await _getTopRatedTv(1)
                hindiRes = await _getHindiTv(1)
            } else {
                popularRes = await _getPopular(1)
                topRatetRes = await _getTopRated(1)
                hindiRes = await _getHindiMovies(1)
            }


            const carousel = popularRes.results.slice(0, 5)
            const popular = popularRes.results.slice(5, 15)
            const top = topRatetRes.results.slice(0, 10)
            const hindi = hindiRes.results.slice(0, 10)


            setData({ carousel, popular, top, hindi })
            // setRes({ popular: popularRes, top: topRatetRes, hindi: hindiRes })
            setLoading(false)
            console.log(data);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        _init()
        // eslint-disable-next-line
    }, [tv])

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!data) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <h3 className='text-white'>connection error</h3>
            </div>
        );
    }

    return (
        <main>
            {/* carousel */}
            <Header tv={tv} />
            <Carousel controls={false} fade={true}>
                {
                    data.carousel?.map((o, i) => (
                        <Carousel.Item key={i}>
                            <div className='carousel' style={{ background: "linear-gradient(var(--primary),rgba(0,0,0,0.1),var(--primary)), url(" + imageUrl + 'original' + o.backdrop_path + ")", ...styles.carouselImg }}>
                                <div className='info'>
                                    <b className='display-4 bold'>{o.title || o.name}</b>
                                    <div className='underline bg-dark'></div>
                                    <div className='d-flex'>
                                        <img src={imageUrl + 'w300' + o.poster_path} className="poster" alt="poster" />
                                        <div className='desc'>
                                            <div>
                                                <b className='text-white'>Rating : {o.vote_average} / 10</b><br />
                                                <b className='text-muted'>{o.release_date?.split("-")[0] || o.first_air_date.split("-")[0]}</b>
                                                <br />
                                            </div>
                                            <Link to={tv ? "/tv/play/" + o.id + "/1/1" : "/movie/play/" + o.id} state={{ item: o }} className='playBtn'>Watch Now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item >
                    ))
                }
            </Carousel >
            <hr className='text-muted mt-0' />
            {/* popular*/}
            <div>
                <Link to={tv ? '/tv/popular/1' : '/movie/popular/1'} className='list-title'>
                    <b>Popular</b>
                    <BsChevronRight />
                </Link>
                <div className='d-flex horizontal-list'>
                    {
                        data?.popular.map((o, i) => (
                            <Banner key={i} item={o} index={i} tv={tv} />
                        ))
                    }
                </div>
                <hr className='text-muted' />
            </div>
            {/* top rated */}
            <div>
                <Link to={tv ? '/tv/top/1' : '/movie/top/1'} className='list-title'>
                    <b>Top Rated</b>
                    <BsChevronRight />
                </Link>
                <div className='d-flex horizontal-list'>
                    {
                        data?.top.map((o, i) => (
                            <Banner key={i} item={o} index={i} tv={tv} />
                        ))
                    }
                </div>
                <hr className='text-muted' />
            </div>
            <div>
                <Link to={tv ? '/tv/indian/1' : '/movie/indian/1'} className='list-title'>
                    <b>Indian</b>
                    <BsChevronRight />
                </Link>
                <div className='d-flex horizontal-list'>
                    {
                        data?.hindi.map((o, i) => (
                            <Banner key={i} item={o} index={i} tv={tv} />
                        ))
                    }
                </div>
            </div>
            <Footer />
        </main >
    )
}

const styles = {
    carouselImg: {
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top center"

    }
}
