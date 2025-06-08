/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getInitials } from "../../utils/formatNames";
import { FaCalendar, FaHeart, FaRegHeart } from "react-icons/fa";
import { getCreatedDate } from "../../utils/formatDates";
import { MdDelete } from "react-icons/md";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import AvatarPlaceholder from "../../assets/images/avatarPlaceholder.png";

const CommentCard = ({
  comment,
  handleDeleteComment,
  handleDeleteCommentByAdmin,
  onReply,
  children, // <-- For nested replies
  isReplyingTo,
}) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { user, token } = useContext(AuthContext);
  const addToast = useToast();
  const [userAvatar, setUserAvatar] = useState(AvatarPlaceholder);
  const [showReplies, setShowReplies] = useState(false);
  const [likedByUser, setLikedByUser] = useState(comment?.likedByUser || false);
  const [likesCount, setLikesCount] = useState(comment?.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLikeToggle = async () => {
    setLikeLoading(true);
    try {
      await axios.post(
        `${base_url}/blogs/${comment.blogId}/comment/${comment._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikedByUser((prev) => !prev);
      setLikesCount((prev) => (likedByUser ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      addToast("Failed to like comment", "toaster-error");
    } finally {
      setLikeLoading(false);
    }
  };

  useEffect(() => {
    if (isReplyingTo) {
      setShowReplies(true); // Auto-show replies when replying to this comment
    }
  }, [isReplyingTo]);

  // Only count children if they exist and are not empty
  const repliesCount = React.Children.toArray(children).filter(Boolean).length;
  const hasReplies = repliesCount > 0;

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const res = await axios.get(
          `${base_url}/users/user/${comment?.author?.id}/get-avatar-url`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserAvatar(res.data.avatar_url || AvatarPlaceholder);
      } catch (error) {
        console.log(error);
        setUserAvatar(AvatarPlaceholder);
      }
    };
    fetchUserAvatar();
  }, [comment?.author?.id, token]);

  const handleReplyClick = () => {
    setShowReplies(!showReplies);
    onReply?.(comment?._id);
  };
  return (
    <div className="bm-comment-card" key={comment?._id}>
      <div className="bm-comment-card-u">
        <div className="bm-comment-card-u-avatar">
          {comment?.author?.avatar_url?.length > 0 ? (
            <img src={userAvatar} alt="avatar" />
          ) : (
            <span>{getInitials(comment?.author?.name)}</span>
          )}
        </div>

        <div className="bm-comment-card-u-info-comment">
          <div className="bm-comment-card-u-info">
            <p className="bm-comment-name">
              <Link to={`/profile/${comment?.author?.id}`}>
                {comment?.author?.name}
              </Link>
            </p>
            <span>
              <FaCalendar size={14} />
              {getCreatedDate(comment?.createdAt)}
            </span>
          </div>

          <div className="bm-comment-card-u-content-c">
            <div className="bm-comment-card-u-content">
              <p>{comment?.text}</p>
            </div>

            <div className="bm-comment-card-u-action">
              {/* Like Button */}
              <button
                onClick={handleLikeToggle}
                disabled={!user || likeLoading}
              >
                {likedByUser ? (
                  <FaHeart size={16} color="red" />
                ) : (
                  <FaRegHeart size={16} />
                )}
                <span>{likesCount}</span>
              </button>

              {/* Delete Button */}
              {(user?._id === comment?.author?.id || user?.isAdmin) && (
                <button
                  className={user?.isAdmin ? "admin-comment-delete-btn" : ""}
                  onClick={async () => {
                    setDeleteLoading(true);
                    try {
                      if (user?.isAdmin) {
                        await handleDeleteCommentByAdmin(comment._id);
                      } else {
                        await handleDeleteComment(comment._id);
                      }
                      addToast("Comment deleted", "toaster-success");
                    } catch (err) {
                      console.error("Delete failed:", err);
                      addToast("Failed to delete comment", "toaster-error");
                    } finally {
                      setDeleteLoading(false);
                    }
                  }}
                  disabled={deleteLoading}
                >
                  <MdDelete size={16} />
                  <span>
                    {deleteLoading
                      ? "Deleting..."
                      : user?.isAdmin
                      ? "Admin Delete"
                      : "Delete"}
                  </span>
                </button>
              )}

              {/* Reply Button */}
              <button onClick={handleReplyClick}>
                <span>Reply</span>
              </button>
            </div>
          </div>

          {/* Toggle Replies Button */}
          {hasReplies && (
            <button
              className="bm-toggle-replies-btn"
              onClick={() => setShowReplies((prev) => !prev)}
            >
              {showReplies ? "Hide Replies" : `Show Replies (${repliesCount})`}
            </button>
          )}

          {/* Render replies only if showing or replying */}
          {(showReplies || isReplyingTo) && hasReplies && (
            <div className="bm-comment-replies">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentCard);
