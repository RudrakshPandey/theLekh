/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getInitials } from '../../utils/formatNames';
import AvatarPlaceHolder from '../../assets/images/avatarPlaceholder.png';
import axios from 'axios';
import '../../styles/profileConnections.css';

const ProfileConnectionCard = ({ data }) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { user, token } = useContext(AuthContext);
  const [userAvatar, setUserAvatar] = useState(AvatarPlaceHolder);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await axios.get(
          `${base_url}/users/user/${data._id}/get-avatar-url`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserAvatar(res.data.avatar_url);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAvatar();
  }, []);

  const profileLink = data._id === user._id ? '/profile' : `/profile/${data._id}`;

  return (
    <Link to={profileLink} className='connection-card' style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className='connection-avatar'>
        {data?.avatar_url?.length > 0 ? (
          <img src={userAvatar} alt='avatar' />
        ) : (
          <span className='connection-initials'>{getInitials(data?.name)}</span>
        )}
      </div>
      <div className='connection-info'>
        <span className='connection-name'>{data?.name}</span>
        <span className='connection-title'>{data?.title}</span>
      </div>
    </Link>
  );
};

export default ProfileConnectionCard;
