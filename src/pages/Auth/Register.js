import React, { useState } from "react";
import { logo } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { mversePost } from "../../utils/mverse-api.service";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    setError("");
    if (!email) {
      setError("Invalid email");
      return;
    }
    if (password?.length < 8) {
      setError("Password must be greater than 7 digit");
      return;
    }
    setLoading(true);
    try {
      const res = await mversePost("/auth/signup", { email, password, name });
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
      } else {
        setError(res.error);
      }
      setLoading(false);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main">
        {error ? (
          <div
            className="alert alert-danger p-2 w-100 rounded-0 m-0"
            style={{ position: "fixed", bottom: "0px; z-index: 100" }}
            role="alert"
          >
            <p class="d-inline">{error}</p>
          </div>
        ) : null}

        <form
          className="my-form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          {/* Headings for the form  */}
          <div className="headingsContainer d-flex align-items-end justify-content-center">
            <img src={logo} className="logo" alt="logo" />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <p>Register using Email and password</p>
          </div>
          {/* Main container for all inputs */}
          <div className="mainContainer">
            {/* Username */}
            <label for="username">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              name="name"
              required
            />

            <br />
            <label for="username">Your Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              required
            />

            <br />

            {/* Password */}
            <label for="pswrd">Your Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              required
            />

            {/* Submit button */}
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="d-flex">
              <p>Already have account ?</p>
              &nbsp;
              <Link className="text-white .link" to="/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
