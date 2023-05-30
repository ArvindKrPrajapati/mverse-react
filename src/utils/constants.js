export const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2JhYjIwYmZiMDUzOTNlMDFiZjFmZjg1OTY2NzI1NSIsInN1YiI6IjYyZGJjZDhkZTMyM2YzMDM2YWRlMmE3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A-ZzzYQ4QU7SqOzUJv_Wfpeh0hDYXA2aIUQ3Twggzsw";

export const url = "https://api.themoviedb.org/3";
export const imageUrl = "https://image.tmdb.org/t/p/";
export const logo = require("../assets/logo.png");
export const mverseToken = () => localStorage.getItem("token");
export const user = () => JSON.parse(localStorage.getItem("user"));
export const mverseUrl = "https://mytodo-api.cyclic.app/v1";
