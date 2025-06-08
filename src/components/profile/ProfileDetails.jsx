/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/profiletabs.css';

const ProfileDetails = ({ user }) => {
  const { loading } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const base_url = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${base_url}/blogs`);
        if (res) {
          const userBlogs = res.data.blogs.filter(
            (blog) => blog.author.id === user._id
          );
          setBlogs(userBlogs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [user]);

  if (loading) return <div className="profile-details-loading">Loading...</div>;

  return (
    <div className="profile-details-container">
      <div className="profile-section">
        <h3 className="section-title">About Me</h3>
        {user?.about?.length > 0 ? (
          <p className="section-text">{user.about}</p>
        ) : (
          <p className="section-placeholder">Edit profile to add About info.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">Recent Blogs</h3>
        {isLoading ? (
          <p className="section-placeholder">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <ul className="recent-blogs-list">
            {blogs.slice(0, 3).map((blog) => (
              <li key={blog._id}>
                <Link to={`/blogs/blog/${blog._id}`} className="blog-link">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="section-placeholder">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
