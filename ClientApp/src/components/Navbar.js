import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ title }) {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
    };

    return (

        <div className="navbar-wrapper">

            <div className="navbar">

                {/* Left Title */}
                <div className="nav-left">
                    {title}
                </div>


                {/* Center Navigation Buttons */}
                <div className="nav-center">
                    <button
                        className="nav-pill"
                        onClick={() => navigate("/")}
                    >
                        Dashboard
                    </button>
                    <button
                        className="nav-pill"
                        onClick={() => navigate("/upload")}
                    >
                        New Import
                    </button>

                    <button
                        className="nav-pill"
                        onClick={() => navigate("/history")}
                    >
                        Import History
                    </button>

                    <button
                        className="nav-pill"
                        onClick={() => navigate("/templates")}
                    >
                        Templates
                    </button>

                </div>


                {/* Logout */}
                <div className="nav-right">

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Navbar;