import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { imageUrl } from "../../utils/constants";
import "./style.css";
import {
  _getMovieDetails,
  _getRecommendations,
  _getRecommendationsTv,
  _getSimilar,
  _getSimilarTv,
  _getTvDetails,
} from "../../utils/api.service";
import Banner from "../../components/Banner";
import { Spinner } from "react-bootstrap";
import SeasonsAndEpisodes from "../../components/SeasonsAndEpisodes";
import Loading from "../../components/Loading";
import Player from "../../components/Player";
import Footer from "../../components/Footer";
import { BsChevronRight } from "react-icons/bs";
import BeautyStars from "beauty-stars";
import { mverseGet } from "../../utils/mverse-api.service";
import JWPlayer from "@jwplayer/jwplayer-react";

export default function Play({ tv }) {
  const location = useLocation();
  const params = useParams();
  const [data, setData] = useState(location?.state?.item);
  const [id, setId] = useState(params?.id);
  const [season, setSeason] = useState(params?.s);
  const [episode, setEpisode] = useState(params?.e);
  const [recomendation, setRecomendation] = useState();
  const [similar, setSimilar] = useState();
  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState(0);

  const [isMverse, setIsMverse] = useState(true);
  const [sources, setSources] = useState([]);
  const [mverseLoading, setMverseLoading] = useState(true);
  const _init = async () => {
    try {
      var _id = params?.id;
      setLoading(true);
      setMverseLoading(true);
      const mverseRes = await mverseGet("/mverse/details/" + _id);
      if (mverseRes.success) {
        setMverseLoading(false);
        setSources(
          mverseRes.data.map((item) => {
            return {
              file: item.video[0].href,
              label: item.video[0].resolution + "p - " + item.video[0].language,
              type: "video/mp4",
            };
          })
        );
      } else {
        console.log(mverseRes);
      }
      setId(_id);
      setSeason(params?.s);
      setEpisode(params?.e);
      var recRes;
      var simRes;
      if (tv) {
        let res = await _getTvDetails(_id);
        setData(res);
        recRes = await _getRecommendationsTv(_id, 1);
        simRes = await _getSimilarTv(_id, 1);
      } else {
        let res = await _getMovieDetails(_id);
        setData(res);
        recRes = await _getRecommendations(_id, 1);
        simRes = await _getSimilar(_id, 1);
      }
      setRecomendation(recRes?.results);
      setSimilar(simRes?.results);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      console.log("details screen", error);
    }
  };

  useEffect(() => {
    _init();
    // eslint-disable-next-line
  }, [params]);

  if (!data) {
    return <Loading />;
  }

  return (
    <main
      className="vh-100 main"
      style={{
        background:
          "linear-gradient(var(--primary),rgba(0,0,0,0.7),var(--primary)), url(" +
          imageUrl +
          "original" +
          data.backdrop_path +
          ")",
        ...styles.carouselImg,
      }}
    >
      <Header tv={tv} />
      <main className="inside-main">
        <div>
          {isMverse ? (
            <div>
              <div
                style={{
                  background: "black",
                  width: "100%",
                  aspectRatio: "16/9",
                }}
              >
                {!mverseLoading && sources.length ? (
                  <JWPlayer
                    sources={sources}
                    library="https://cdn.jwplayer.com/libraries/5TLRxR5E.js"
                  />
                ) : null}
                {!mverseLoading && sources.length === 0 ? (
                  <div className="d-flex h-100 justify-content-center align-items-center text-white">
                    Not Found
                  </div>
                ) : null}
              </div>
              <small
                className="d-block text-warning"
                style={{ textAlign: "center", marginTop: "8px" }}
              >
                If current server do not work try other server below
              </small>
              <div
                className="p-2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => {
                    setIsMverse(true);
                  }}
                  className="btn text-white m-1"
                  style={
                    isMverse
                      ? { backgroundColor: "var(--tertiory)" }
                      : { backgroundColor: "var(--secondary)" }
                  }
                >
                  Mverse
                </button>
                <button
                  onClick={() => {
                    setIsMverse(false);
                  }}
                  className="btn text-white m-1"
                  style={
                    !isMverse
                      ? { backgroundColor: "var(--tertiory)" }
                      : { backgroundColor: "var(--secondary)" }
                  }
                >
                  Other server
                </button>
              </div>
            </div>
          ) : (
            <Player
              data={data}
              tv={tv}
              season={season}
              episode={episode}
              setIsMverse={setIsMverse}
            />
          )}
        </div>
        <div className="d-flex p-3">
          <div className="d-none d-md-block">
            <div style={{ position: "sticky", top: "20%" }}>
              <img
                src={imageUrl + "w300" + data.poster_path}
                className="poster_img"
                alt="img"
              />
              <br />
              <div className="p-2">
                <b className="text-white">Rate this</b>
                <BeautyStars
                  value={star}
                  onChange={(value) => setStar(value)}
                />
              </div>
            </div>
          </div>
          <div className="details">
            <b className="title d-block">{data.title || data.name}</b>
            <b className="text-muted">
              {data.release_date?.split("-")[0] ||
                data.first_air_date?.split("-")[0]}
            </b>
            <b className="text-muted d-block">
              Rating : {data.vote_average} / 10
            </b>
            <p className="d-block text-white">{data.overview}</p>
            {tv && !loading ? (
              <SeasonsAndEpisodes
                data={data}
                season={season}
                episode={episode}
              />
            ) : (
              <></>
            )}
            <br />
            <hr className="text-muted" />
            {!loading ? (
              <>
                <div>
                  <Link
                    to={
                      tv
                        ? "/tv/recomended/" + id + "/1"
                        : "/movie/recomended/" + id + "/1"
                    }
                    className="list-title m-0"
                  >
                    <h3 className="text-white">You may also like</h3>
                    <BsChevronRight />
                  </Link>
                  <div className="d-flex horizontal-list">
                    {recomendation?.slice(0, 10)?.map((o, i) => (
                      <Banner key={i} item={o} tv={tv} />
                    ))}
                  </div>
                  <hr className="text-muted" />
                </div>
                <div>
                  <Link
                    to={
                      tv
                        ? "/tv/similar/" + id + "/1"
                        : "/movie/similar/" + id + "/1"
                    }
                    className="list-title m-0"
                  >
                    <h3 className="text-white">Similar </h3>
                    <BsChevronRight />
                  </Link>
                  <div className="d-flex horizontal-list">
                    {similar?.slice(0, 10)?.map((o, i) => (
                      <Banner key={i} item={o} tv={tv} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Spinner
                className="d-block m-auto"
                animation="grow"
                variant="light"
              />
            )}
          </div>
        </div>
        <Footer />
      </main>
    </main>
  );
}
const styles = {
  carouselImg: {
    height: "70vh",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
};
