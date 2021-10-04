import React, { useEffect, useState } from "react";
import FormControl from "./components/FormControl";
import axios from "axios";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/admin");
    }
  }, [history]);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(username);

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { username, password },
        config
      );

      localStorage.setItem("authToken", data.token);

      history.push("/admin");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-header">
        <h3>Вход</h3>
      </div>
      <div className="login-body">
        <form id="login-form" onSubmit={handleLogin}>
          <FormControl
            label="Логин: "
            type="text"
            name=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl
            label="Пароль: "
            type="password"
            name=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl type="submit" value="Войти" />
        </form>
      </div>
      <div className="login-footer">
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
