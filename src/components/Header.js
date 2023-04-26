import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo, user } from "../utils/constants";
import "./header.css";
import { BsChevronRight, BsCast, BsSearch } from "react-icons/bs";
import { BiMoviePlay } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";

export default function Header({ tv, focus, onChange, searchTerm }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="d-flex align-items-center">
        <Link to="/">
          <img src={logo} className="logo" alt="logo" />
        </Link>
        <Link
          to={tv ? "/tv/browse/1" : "/movie/browse/1"}
          className="text-decoration-none text-white"
        >
          <b className="d-none d-md-inline">Browse</b>
          <BsChevronRight />
        </Link>
      </div>
      <div className="d-flex align-items-center">
        <Link className="input-link" to="/search" state={{ tv }}>
          <input
            type="search"
            className="input d-none d-md-block"
            placeholder="search movies"
            autoFocus={focus}
            onChange={(e) => {
              onChange && onChange(e);
            }}
            value={searchTerm}
          />
        </Link>
        <Link
          to="/"
          className="header-btn"
          style={!tv ? { color: "var(--tertiory)" } : {}}
        >
          <BiMoviePlay />
          &nbsp;
          <b className="d-none d-md-block">Movies</b>
        </Link>
        <Link
          to="/tv"
          className="header-btn"
          style={tv ? { color: "var(--tertiory)" } : {}}
        >
          <BsCast />
          &nbsp;
          <b className="d-none d-md-block">Tv</b>
        </Link>
        <Link className="d-block d-md-none header-btn" to="/search">
          <BsSearch />
        </Link>
        {user()?.name ? (
          <Link onClick={logout} className="header-btn">
            <AiOutlineLogout /> &nbsp;{user().name.split(" ")[0]}
          </Link>
        ) : (
          <Link to="/login" className="header-btn">
            <b>Login</b>
          </Link>
        )}
        {/* <Link to="/login" className="header-btn">
          {user?.name ? (
            <>
              <AiOutlineLogout /> &nbsp;{user.name.split(" ")[0]}
            </>
          ) : (
            <b>Login</b>
          )}
        </Link> */}
      </div>
    </header>
  );
}
