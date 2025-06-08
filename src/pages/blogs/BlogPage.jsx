/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MdOutlineAccessTime, MdEdit, MdDelete } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import "../../styles/blogpage.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getInitials } from "../../utils/formatNames";
import AuthContext from "../../context/AuthContext";
import { getCreatedDate } from "../../utils/formatDates";
import BlogComments from "../../components/blogs/BlogComments";
import AvatarPlaceHolder from "../../assets/images/avatarPlaceholder.png";
import { Helmet } from "react-helmet";
import BlogPageSkeleton from "../../components/ui/skeletons/BlogPageSkeleton";
import ConfirmModal from "../../components/ui/ConfirmModal";

const base_url = import.meta.env.VITE_API_BASE_URL;

const BlogPage = () => {
  const { loading, user, token } = useContext(AuthContext);
  const [blog, setBlog] = useState({});
  const [userAvatar, setUserAvatar] = useState(AvatarPlaceHolder);
  const [isloading, setIsloading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const handleImageClick = () => setIsImageModalOpen(true);
  const closeModal = () => setIsImageModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const fetchBlog = async () => {
    setIsloading(true);
    try {
      const blogRes = await axios.get(`${base_url}/blogs/blog/${params.id}`);
      const blogData = blogRes.data.blog;
      setBlog(blogData);
      if (blogData?.author?.id) {
        fetchUserAvatar(blogData.author.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchUserAvatar = async (id) => {
    try {
      const res = await axios.get(
        `${base_url}/users/user/${id}/get-avatar-url`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserAvatar(res.data.avatar_url);
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  const handleAdminDeleteConfirmed = async () => {
    try {
      await axios.delete(`${base_url}/blogs/admin/delete-blog/${blog?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Blog deleted successfully. Redirecting...");
      setIsDeleteModalOpen(false);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog.");
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading || isloading) {
    return (
      <div className="blogpage-container">
        <BlogPageSkeleton />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${blog?.title} | ${blog?.author?.name} | the Lekh`}</title>
      </Helmet>
      <div className="blogpage-container">
        <div className="blogpage-back-c">
          <Link to="/home">
            <FaArrowCircleLeft /> back to blogs
          </Link>
        </div>

        {(user?._id === blog?.author?.id || user?.isAdmin) && (
          <div className="blogpage-main-action-c">
            {user?._id === blog?.author?.id && (
              <Link
                to={`/blogs/blog/edit/${blog?._id}`}
                className="edit-blog-btn"
              >
                <MdEdit className="edit-icon" />
                <span>Edit</span>
              </Link>
            )}
            {user?.isAdmin && (
              <button className="admin-delete-btn" onClick={openDeleteModal}>
                <MdDelete className="admin-delete-icon" />
                <span className="admin-delete-text">Delete</span>
              </button>
            )}
          </div>
        )}

        <div className="blogpage-main-c">
          <div className="blogpage-m-tags-c">
            <span className="bmtag">{blog?.category}</span>
            <span className="bmreadt">
              <MdOutlineAccessTime />
              {`${blog?.readingTime || "0"} min`}
            </span>
          </div>

          <div className="bm-header">
            <h1
              className={
                blog?.title?.includes("deleted by admin")
                  ? "admin-deleted-text"
                  : ""
              }
            >
              {blog?.title}
            </h1>
          </div>

          <div className="bm-user-card">
            <div className="bm-user-card-av-c">
              {blog?.author?.avatar_url?.length > 0 ? (
                <img src={userAvatar} alt="avatar" />
              ) : (
                blog?.author && getInitials(blog?.author?.name)
              )}
            </div>
            <div className="bm-user-card-info">
              <p>
                <Link to={`/profile/${blog?.author?.id}`}>
                  {blog?.author?.name}
                </Link>
              </p>
              <span>
                <CiCalendar /> {getCreatedDate(blog?.createdAt)}
              </span>
            </div>
          </div>

          <div className="bm-image-content-c">
            <div className="bm-hero-image" onClick={handleImageClick}>
              <img src={blog?.heroImage} alt="hero" />
            </div>

            <div className="bm-excerpt">
              <p>{blog?.excerpt}</p>
            </div>

            <div
              className="bm-content"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            ></div>
          </div>

          {/* Modal for full-size image */}
          {isImageModalOpen && (
            <div className="image-modal" onClick={closeModal}>
              <div
                className="image-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-button" onClick={closeModal}>
                  &times;
                </button>
                <img
                  src={blog?.heroImage}
                  alt="Full hero"
                  className="modal-img"
                />
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bm-likes-comments-container">
            <BlogComments />
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleAdminDeleteConfirmed}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default BlogPage;
