import '../../styles/login.css';
import { useState } from 'react';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Logo from '../Logo';
import { Link, useNavigate, useParams } from 'react-router-dom';

const react_base_url = import.meta.env.VITE_API_BASE_URL;

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);

  const { token } = useParams();
  const emailId = new URLSearchParams(window.location.search).get('emailId') || '';

  const navigate = useNavigate();

  const validatePassword = () => {
    return (
      password.length >= 8 &&
      /[!-/:-@[-`{-~]/.test(password) &&
      !(
        password.includes(emailId) ||
        password === emailId ||
        password.includes(emailId.split('@')[0]) ||
        password.startsWith(emailId.slice(0, 4))
      )
    );
  };

  const checkInputs = () => {
    const isPasswordValid = validatePassword();
    const isConfirmed = confirmPassword.length > 2;
    setIsDone(isPasswordValid && isConfirmed);
  };

  const handleInputChange = (e, name) => {
    setErrors({});
    const { value } = e.target;

    if (name === 'confirm-password') {
      setConfirmPassword(value);
    } else {
      setPassword(value);
    }

    setTimeout(() => {
      checkInputs();
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({
        password: 'Passwords do not match',
        confirmPassword: 'Passwords do not match',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${react_base_url}/users/reset-password/${token}`,
        { password }
      );

      console.log('Password reset successful:', response.data);
      setPasswordDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Password reset failed:', error?.response?.data || error);
      setErrors({
        server: error.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const togglePass = () => setShowPassword(!showPassword);

  return (
    <div className='login-div'>
      <div className='login-branding'>
        <Link to='/'>
          <Logo />
        </Link>
      </div>

      {passwordDone ? (
        <div className='login-container'>
          <div className='login-fm-header'>
            <h2>Reset your Password</h2>
            <div className='form-group'>
              <span className='reset-success-span'>
                <FaCheck /> Password successfully updated!
              </span>
              <Link className='submit-button' to='/login'>Login</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className='login-container'>
          <div className='login-fm-header'>
            <h2>Reset your Password</h2>
            <p>Enter your new password</p>
            {errors.server && (
              <span className='error-message server-error'>{errors.server}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className='login-form'>
            {/* Email Display */}
            <div className='form-group'>
              <label htmlFor='email' className='login-email'>Email</label>
              <input type='email' id='email' value={emailId} disabled />
            </div>

            {/* Password Input */}
            <div className='form-group login-password-group'>
              <label htmlFor='password'>New Password</label>
              <div className='login-password-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  className={errors.password ? 'error' : ''}
                />
                <span className='login-toggle-password' onClick={togglePass}>
                  {showPassword ? <LuEye /> : <LuEyeOff />}
                </span>
              </div>
              {errors.password && (
                <span className='error-message'>{errors.password}</span>
              )}
              <span className='reset-pass-validate' style={{ color: password.length >= 8 ? '#333' : '#ff4b4b' }}>
                {password.length >= 8 ? <FaCheck style={{ color: 'green' }} /> : <MdOutlineCancel />} Must be at least 8 characters.
              </span>
              <span className='reset-pass-validate' style={{ color: /[!-/:-@[-`{-~]/.test(password) ? '#333' : '#ff4b4b' }}>
                {/[!-/:-@[-`{-~]/.test(password) ? <FaCheck style={{ color: 'green' }} /> : <MdOutlineCancel />} Must contain special characters.
              </span>
              <span className='reset-pass-validate' style={{ color: validatePassword() ? '#333' : '#ff4b4b' }}>
                {!(
                  password.includes(emailId) ||
                  password === emailId ||
                  password.includes(emailId.split('@')[0]) ||
                  password.startsWith(emailId.slice(0, 4))
                ) ? (
                  <FaCheck style={{ color: 'green' }} />
                ) : (
                  <MdOutlineCancel />
                )} Does not contain your email address.
              </span>
            </div>

            {/* Confirm Password */}
            <div className='form-group login-password-group'>
              <label htmlFor='confirm-password'>Confirm New Password</label>
              <div className='login-password-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='confirm-password'
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, 'confirm-password')}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <span className='login-toggle-password' onClick={togglePass}>
                  {showPassword ? <LuEye /> : <LuEyeOff />}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className='error-message'>{errors.confirmPassword}</span>
              )}
            </div>

            <div className='form-group'>
              <button
                type='submit'
                className={`submit-button ${!isDone ? 'reset-disable' : ''}`}
                disabled={!isDone}
              >
                {isDone ? 'Reset Password' : 'No Reset Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
