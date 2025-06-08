import { FaRegHeart, FaRegCommentAlt } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/profileBlogCards.css';
import AuthContext from '../../context/AuthContext';
import AvatarPlaceholder from '../../assets/images/avatarPlaceholder.png';
import { getJoinedDate } from '../../utils/formatDates';
import { getInitials } from '../../utils/formatNames';

const ProfileBlogCard = ({ blog, handleModal }) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { user, token } = useContext(AuthContext);
  const [userAvatar, setUserAvatar] = useState(AvatarPlaceholder);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUseAvatar = async () => {
      try {
        const res = await axios.get(
          `${base_url}/users/user/${blog?.author?.id}/get-avatar-url`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserAvatar(res.data.avatar_url);
      } catch {
        setUserAvatar(AvatarPlaceholder);
      }
    };
    fetchUseAvatar();
  }, []);

  if (!blog) return <div>Loading...</div>;

  const handleClick = () => navigate(`/blogs/blog/${blog._id}`);

  return (
    <div className="pb-card-container" onClick={handleClick}>
      <div className="pb-card-content">
        <div className="pb-card-left">
          <div className="pb-card-header">
            <div className="pb-card-avatar">
              {blog.author.avatar_url.length < 1 ? (
                getInitials(blog?.author?.name)
              ) : (
                <img src={userAvatar} alt="Author avatar" />
              )}
            </div>
            <div className="pb-card-user-info">
              <Link to={`/profile/${blog.author.id}`} className="pb-author-name" onClick={(e) => e.stopPropagation()}>
                {blog.author.name}
              </Link>
              <p className="pb-created-date">{getJoinedDate(blog.createdAt)}</p>
            </div>
          </div>

          <div className="pb-card-body">
            <h2 className="pb-card-title">
              <Link to={`/blogs/blog/${blog._id}`} onClick={(e) => e.stopPropagation()}>
                {blog.title}
              </Link>
            </h2>
          </div>

          <div className="pb-card-footer">
            <div className="pb-card-interactions">
              <div className="pb-icon-text">
                <FaRegHeart />
                <span>{blog.likes.length}</span>
              </div>
              <div className="pb-icon-text">
                <FaRegCommentAlt />
                <span>{blog.comments.length}</span>
              </div>
            </div>
            {blog?.author?.id === user._id && (
              <div className="pb-card-controls">
                <Link to={`/blogs/blog/edit/${blog._id}`} className="pb-icon-btn" onClick={(e) => e.stopPropagation()}>
                  <MdEdit />
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModal(blog._id);
                  }}
                  className="pb-icon-btn"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {blog?.heroImage && (
          <div className="pb-card-image-wrapper">
            <img src={blog.heroImage} alt="Blog visual" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBlogCard;
