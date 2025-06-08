/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LikeComponent = () => {
  const { user, token } = useContext(AuthContext);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();

  const [blog, setBlog] = useState({});

  // Fetch blog data from API
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${base_url}/blogs/blog/${params.id}`);
      setBlog(res.data.blog);
    } catch (error) {
      console.log(error);
    }
  };

  // Call fetchBlog once on mount
  useEffect(() => {
    fetchBlog();
  }, []);

  // Derived liked status — no local state needed
  const liked = user && blog.likes?.some((likeId) => likeId === user._id);

  // Handle like/unlike click
  const handleLike = async () => {
    if (!user || !token) {
      console.log('User not logged in');
      return;
    }

    try {
      await axios.post(`${base_url}/blogs/${params.id}/like`, '', {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBlog(); // re-fetch blog with updated likes
    } catch (err) {
      console.log('Like/unlike error:', err);
    }
  };

  return (
    <div
      className="bm-like-c"
      onClick={handleLike}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
    >
      {liked ? (
        <FaHeart className="liked" />
      ) : (
        <FaRegHeart />
      )}
      <span>{`${blog?.likes?.length || 0} Likes`}</span>
    </div>
  );
};

export default LikeComponent;
