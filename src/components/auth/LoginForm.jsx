import "../../styles/login.css";
import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { validateLoginForm } from "../../validators/auth/loginValidator";
import InputComponent from "../ui/InputComponent";
import AuthContext from "../../context/AuthContext";
import SocialLogin from "./SocialLogin";
import { Oval } from "react-loader-spinner";
// import Logo from "../Logo";

const LoginForm = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePass = () => setShowPassword(!showPassword);

  const getInputClass = (fieldName) => (errors[fieldName] ? "input-error" : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validateLoginForm(formData);
    if (validationErrors) {
      setLoading(false);
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await loginUser(formData); // Make sure your backend accepts { identifier, password }
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      setErrors({
        server:
          error.response?.data?.message ||
          error.response?.statusText ||
          "Something went wrong",
      });
    }
  };

  const handleSocialSuccess = (data) => {
    localStorage.setItem("blog_AuthToken", data.token);
    const decoded = jwtDecode(data.token);
    dispatch({ type: "LOGIN", payload: { decoded, token: data.token } });
    navigate("/home");
  };

  return (
    <div className="login-div">
      {/* <div className="login-branding">
        <Link to="/">
          <Logo />
        </Link>
      </div> */}
      <div className="login-container">
        <div className="login-fm-header">
          <h2>Login</h2>
          <p>Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {errors.server && (
            <div className="login-server-error">{errors.server}</div>
          )}
          {location.state?.message && (
            <p className="login-success-message">{location.state?.message}</p>
          )}

          <InputComponent
            label={"Username or Email"}
            type={"text"}
            id={"identifier"}
            name={"identifier"}
            value={formData.identifier}
            onChange={handleInputChange}
            className={`${getInputClass("identifier")}`}
            error={errors.identifier}
          />

          <div className="form-group login-password-group">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                name="password"
                onChange={handleInputChange}
                className={`${getInputClass("password")}`}
              />
              <span className="login-toggle-password" onClick={togglePass}>
                {showPassword ? <LuEye /> : <LuEyeOff />}
              </span>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            {formData.password.length > 1 && (
              <span className="login-password">
                <a href="/forgot-password">forgot password?</a>
              </span>
            )}
          </div>

          <div className="login-button-wrapper">
            <button type="submit" className="login-button-submit">
              {loading ? (
                <Oval
                  visible={loading}
                  height="20"
                  width="20"
                  color="#fff"
                  ariaLabel="oval-loading"
                />
              ) : (
                `Login`
              )}
            </button>
          </div>
        </form>

        <div className="login-fm-footer">
          <p>
            Don&apos;t have an account? <a href="/register">Sign up</a>
          </p>
        </div>

        <div className="login-social-section">
          <div className="login-social-divider">
            <span>or</span>
          </div>
          <div className="login-social-buttons">
            <SocialLogin onSuccess={handleSocialSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
