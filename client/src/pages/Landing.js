import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { Link, Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import React from "react";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* info column */}
          <div className="info">
            <h1>
              Job <span>Tracking</span> App
            </h1>
            <p>
              Nulla YOLO kogi mukbang letterpress, laboris glossier ut
              adipisicing commodo kitsch. Green juice YOLO artisan est, art
              party snackwave eu adipisicing single-origin coffee. Succulents
              elit tofu, sed tousled gluten-free YOLO. Echo park ugh distillery,
              pickled dolore duis sriracha consequat sint. Fanny pack helvetica
              lo-fi, plaid fugiat magna Brooklyn direct trade disrupt small
              batch banh mi gluten-free adipisicing everyday carry williamsburg.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login / Register
            </Link>
          </div>
          {/* image column */}
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
