import { useState } from "react";
import "../../styles/register.css";
import { validateRegisterForm } from "../../validators/auth/registerValidator";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import InputComponent from "../ui/InputComponent";
import Logo from "../Logo";
import cindy from "../../assets/images/cindy.png";

const react_base_url = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "file" ? e.target.files[0] : e.target.value;
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateRegisterForm(formData) || {};
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${react_base_url}/users/register`,
        formData
      );
      console.log("User created", response.data);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/login", {
          state: { message: "You have been registered. Login now." },
        });
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      const backendErrors = error.response?.data?.errors;
      const backendMessage = error.response?.data?.message;

      if (backendErrors && typeof backendErrors === "object") {
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      } else if (backendMessage && typeof backendMessage === "string") {
        setErrors((prev) => ({ ...prev, server: backendMessage }));
      } else {
        setErrors((prev) => ({
          ...prev,
          server: "An unknown error occurred during registration.",
        }));
      }
    }
  };

  const getInputClass = (fieldName) => {
    return errors[fieldName] ? "input-error" : "";
  };

  return (
    <div className="register-page">
      <div className="register-illustration">
        <img src={cindy} alt="Illustration" />
      </div>
      <div className="register-div">
        <div className="register-branding">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="register-container">
          <div className="register-fm-header">
            <h2>Register</h2>
            <p>Enter your credentials to create your account</p>
          </div>
          <form onSubmit={handleSubmit} className="register-form">
            <InputComponent
              type="text"
              name="name"
              id="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              className={getInputClass("name")}
              error={errors.name}
              required
            />

            <div className="form-groups">
              <div className="form-group">
                <label htmlFor="gender">
                  Gender<span className="label-required">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`register-form-gender-select ${getInputClass(
                    "gender"
                  )}`}
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="error-message">{errors.gender}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dob">
                  Date of Birth<span className="label-required">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  min="1980-01-01"
                  max={new Date().toISOString().split("T")[0]}
                  className={getInputClass("dob")}
                  aria-invalid={!!errors.dob}
                />
                {errors.dob && <p className="error-message">{errors.dob}</p>}
              </div>
            </div>

            <InputComponent
              type="text"
              name="address"
              id="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              className={getInputClass("address")}
              error={errors.address}
              required
            />

            <InputComponent
              type="email"
              name="email"
              id="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass("email")}
              error={errors.email}
              required
            />

            <InputComponent
              type="text"
              name="username"
              id="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              className={getInputClass("username")}
              error={errors.username}
              required
            />

            <InputComponent
              type="password"
              name="password"
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass("password")}
              error={errors.password}
              required
            />

            {errors.server && (
              <div className="form-group">
                <p className="error-message">{errors.server}</p>
              </div>
            )}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <TailSpin
                  height="20"
                  width="20"
                  color="#FFF"
                  ariaLabel="loading"
                />
              ) : (
                "Register"
              )}
            </button>
          </form>
          <div className="register-fm-footer">
            <p>
              Already registered? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
