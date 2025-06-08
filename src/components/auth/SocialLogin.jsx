import '../../styles/socialLogin.css';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const SocialLogin = ({ onSuccess }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="custom-google-login-wrapper">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const res = await axios.post(`${API_BASE_URL}/auth/social`, {
            provider: 'google',
            token: credentialResponse.credential,
          });
          onSuccess(res.data);
        }}
        onError={() => console.log('Login Failed')}
        useOneTap
      />
    </div>
  );
};

export default SocialLogin;