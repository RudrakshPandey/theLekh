import { useState, useEffect, useContext } from 'react';
import '../../styles/profile.css';
import AuthContext from '../../context/AuthContext';
import { getJoinedDate } from '../../utils/formatDates';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

const ProfileComponent = ({ user: profile, triggerDelete }) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { loading, user, token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [blogsCount, setBlogsCount] = useState(0);
  console.log('here');

  const fetchUserBlog = async () => {
    try {
      const blogs = await axios.get(`${base_url}/blogs`);
      if (blogs) {
        const userBlog = blogs.data.blogs.filter(
          (blog) => blog.author.id === profile._id
        );
        setBlogsCount(userBlog.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollower = async () => {
    try {
      const res = await axios.get(
        `${base_url}/users/${profile._id}/followers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowers(res.data.followers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(
        `${base_url}/users/${profile._id}/following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowing(res.data.following);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${base_url}/users/${profile._id}/follow`, '', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchFollower();
      await fetchFollowing();
      setIsFollow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnFollow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${base_url}/users/${profile._id}/unfollow`, '', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchFollower();
      await fetchFollowing();
      setIsFollow(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFollowing = () => {
    if (profile?.followers?.includes(user._id)) {
      setIsFollow(true);
    }
  };

  useEffect(() => {
    fetchFollower();
    fetchFollowing();
    isFollowing();
    fetchUserBlog();
  }, [profile]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='profile-c-container'>
      <div className='profile-c-avatar-circle'>
        {profile?.avatar_url ? (
          <img src={profile?.avatar_url} alt='profile-avatar' />
        ) : (
          profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
        )}
      </div>
      <div className='profile-c-user-details'>
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <div className='pc-user-details-loctn'>
          <div>
            <CiLocationOn />
            <p>{profile.address}</p>
          </div>
          <div>
            <CiCalendar />
            <p>Joined {getJoinedDate(profile.joined)}</p>
          </div>
        </div>
        <div className='pc-user-details-connections'>
          <div>
            <p>{followers?.length || 0}</p>
            <p>Followers</p>
          </div>
          <div>
            <p>{following?.length || 0}</p>
            <p>Following</p>
          </div>
          <div>
            <p>{blogsCount || 0}</p>
            <p>Posts</p>
          </div>
        </div>
        <div className='pc-user-details-edit-btn-c'>
          {profile._id === user._id ? (
            <Link to='/profile/edit' type='button' className='submit-button'>
              Edit Profile
            </Link>
          ) : (
            <>
              <button
                className='submit-button'
                onClick={isFollow ? handleUnFollow : handleFollow}
              >
                {isLoading ? (
                  <Oval
                    visible={isLoading}
                    height='20'
                    width='20'
                    color='#fff'
                    ariaLabel='oval-loading'
                  />
                ) : isFollow ? (
                  'Following'
                ) : (
                  'Follow'
                )}
              </button>
              {user?.isAdmin && (
                <button
                  className='delete-user-button'
                  onClick={triggerDelete}
                >
                  Delete User
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
