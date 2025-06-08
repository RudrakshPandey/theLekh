import { useContext, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import "../styles/login.css";
import AuthContext from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import loginIllus from "../assets/images/loginIllus.png";
import Logo from "../components/Logo";

const LoginPage = () => {
  const { isAuthenticated, loading, loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
  }, []);

  if (isAuthenticated) return <Navigate to="/home" />;
  if (loading) return <div>loading</div>;

  return (
    <>
      <Helmet>
        <title>Login | theLekh</title>
      </Helmet>
      <div className="login-branding">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="login-page-wrapper">
        <div className="login-left">
          <LoginForm />
        </div>
        <div className="login-right">
          <img src={loginIllus} alt="Login Illustration" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
