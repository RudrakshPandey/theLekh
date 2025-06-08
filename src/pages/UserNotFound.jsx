import { useNavigate } from 'react-router-dom';
import '../styles/userNotFound.css';
import tintinImage from '../assets/images/tintin.png'; // adjust path if needed

const UserNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      {/* Left section: Text */}
      <div className="not-found-left">
        <h1 className="code-404">404</h1>
        <h2 className="code-message">Page Not Found!</h2>
        <p>Don&apos;t worry we got Tintin and Snowy on the Case ! </p>

        <div className="button-group">
          <button className="filled-btn" onClick={() => navigate('/home')}>
            ← Take Me Home
          </button>
        </div>
      </div>

      {/* Right section: Tintin Image */}
      <div className="not-found-right">
        <img src={tintinImage} alt="Tintin running with Snowy" />
      </div>
    </div>
  );
};

export default UserNotFound;
