import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [serverUrl, setServerUrl] = useState("");
    const [database, setDatabase] = useState("");
    const [databases, setDatabases] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Auto detect DB from URL
    useEffect(() => {
        const url = window.location.hostname;

        if (url.includes("dev"))
            setDatabase("InnovatorSolutionsDev");
        else if (url.includes("qa"))
            setDatabase("InnovatorSolutionsQA");
        else
            setDatabase("----TEST----");

    }, []);

    const handleLogin = async () => {

        const payload = {
            serverUrl: serverUrl,
            database: database,
            username: username,
            password: password
        };

        try {

            const response = await fetch(
                "https://localhost:7110/api/connection/connect",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (response.ok) {

                localStorage.setItem("connection", JSON.stringify(payload));
                localStorage.setItem("isAuthenticated", "true");

                navigate("/");

            } else {

                const error = await response.json();
                alert(error.error);

            }

        } catch (err) {
            alert("Connection Failed: " + err.message);
        }

    };

    const fetchDatabases = async (url) => {

        if (!url) return;

        if (!url.endsWith("/")) {
            url = url + "/";
        }

        const apiUrl = url + "Server/DbList.aspx";

        try {

            const response = await fetch(apiUrl);

            const text = await response.text();

            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "text/xml");

            const dbNodes = xml.getElementsByTagName("DB");

            const list = [];

            for (let i = 0; i < dbNodes.length; i++) {
                list.push(dbNodes[i].getAttribute("id"));
            }

            setDatabases(list);

        } catch (err) {

            console.error("Error fetching databases", err);
            alert("Unable to fetch database list");

        }
    };

    const handleCancel = () => {

        setServerUrl("");
        setDatabase("");
        setUsername("");
        setPassword("");

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>Advanced Batch Loader</h2>

                <label>Server Url</label>
                <input
                    type="text"
                    placeholder="Server URL"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    onBlur={() => fetchDatabases(serverUrl)}
                />

                <label>Database</label>
                <select
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                >

                    <option value="">Select Database</option>

                    {databases.map((db, index) => (
                        <option key={index} value={db}>
                            {db}
                        </option>
                    ))}

                </select>

                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="button-group">

                    <button
                        className="login-btn"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Login;