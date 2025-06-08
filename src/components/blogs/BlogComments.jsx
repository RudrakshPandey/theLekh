/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import CommentCard from "./CommentCard";
import { getInitials } from "../../utils/formatNames";
import { useToast } from "../../context/ToastContext";
import { Oval } from "react-loader-spinner";
import { FaRegComment, FaPaperPlane } from "react-icons/fa";
import LikeComponent from "./LikeComponent";

const BlogComments = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { loading, user, token } = useContext(AuthContext);
  const params = useParams();
  const addToast = useToast();

  // Separate states for new comment and reply comment text
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Tracks which comment id is currently being replied to, or null
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  const handleNewCommentInput = (e) => {
    setNewComment(e.target.value);
  };

  const handleReplyCommentInput = (e) => {
    setReplyComment(e.target.value);
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${base_url}/blogs/${params.id}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
      addToast("Something went wrong. Please try again.", "toaster-error");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    // Determine which comment input to submit
    const text = replyToCommentId ? replyComment : newComment;

    if (text.trim()) {
      try {
        setIsloading(true);

        await axios.post(
          `${base_url}/blogs/${params.id}/comment`,
          {
            comment: text,
            parentCommentId: replyToCommentId, // null if it's a new comment
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Clear inputs and reset reply state
        setShowComments(true);
        setReplyToCommentId(null);
        setNewComment("");
        setReplyComment("");
        await fetchComments();

        setIsloading(false);
        addToast("Comment added successfully", "toaster-success");

        // Update user rewards for comments (reward: 5)
        // await axios.post(
        //   `${base_url}/users/update-rewards`,
        //   { rewardType: "comment" },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
      } catch (error) {
        setIsloading(false);
        console.log(error);
        addToast("Something went wrong. Please try again.", "toaster-error");
      }
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      setIsloading(true);
      await axios.delete(`${base_url}/blogs/${params.id}/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.log(error);
      addToast("Something went wrong. Please try again.", "toaster-error");
    }
  };

  const handleDeleteCommentByAdmin = async (id) => {
    try {
      setIsloading(true);
      await axios.delete(`${base_url}/blogs/admin/delete-comment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.log(error);
      addToast("Something went wrong. Please try again.", "toaster-error");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check this out!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Render comments recursively with nested replies
  const renderComments = useCallback(
    (parentId = null) => {
      return comments
        .filter((c) => c.parentCommentId === parentId)
        .map((comment) => (
          <div key={comment._id}>
            <CommentCard
              comment={{ ...comment, blogId: params.id }}
              handleDeleteComment={handleDeleteComment}
              handleDeleteCommentByAdmin={handleDeleteCommentByAdmin}
              onReply={(id) => {
                setReplyToCommentId((prev) => (prev === id ? null : id));
                setReplyComment("");
              }}
              isReplyingTo={replyToCommentId === comment._id}
            >
              {renderComments(comment._id)}

              {replyToCommentId === comment._id && (
                <div className="bm-inline-reply-form">
                  <div className="commentform-container reply-mode">
                    <div className="commentform-c-user-a">
                      {user?.avatar_url?.length > 0 ? (
                        <img src={user?.avatar_url} alt="avatar" />
                      ) : (
                        <span>{getInitials(user?.name)}</span>
                      )}
                    </div>

                    <form
                      onSubmit={handleComment}
                      className="comment-form-c-form reply-form-layout"
                    >
                      <div className="reply-input-action-wrapper">
                        <textarea
                          placeholder="Write your reply..."
                          value={replyComment}
                          onChange={handleReplyCommentInput}
                          disabled={isLoading}
                          rows={1}
                        />
                        <div className="bm-inline-reply-actions">
                          <button
                            type="submit"
                            className="reply-submit-btn"
                            disabled={
                              isLoading || replyComment.trim().length === 0
                            }
                          >
                            {isLoading ? "..." : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="reply-cancel-btn"
                            onClick={() => setReplyToCommentId(null)}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </CommentCard>
          </div>
        ));
    },
    [
      comments,
      handleDeleteComment,
      handleDeleteCommentByAdmin,
      replyToCommentId,
    ]
  );

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <div>Loading ...</div>;

  return (
    <>
      <div className="bm-like-comment-c">
        <LikeComponent />
        <button
          className="bm-comment-c"
          onClick={() => {
            setShowComments(!showComments);
          }}
        >
          <FaRegComment />
          {`${comments?.length} Comments`}
        </button>
        <button className="bm-share-c" onClick={handleShare}>
          <FaPaperPlane />
          Share
        </button>
      </div>

      {/* Global New Comment Form */}
      <div className="commentform-container">
        <div className="commentform-c-user-a">
          {user?.avatar_url?.length > 0 ? (
            <img src={user?.avatar_url} alt="avatar" />
          ) : (
            <span>{getInitials(user?.name)}</span>
          )}
        </div>

        <form
          className="comment-form-c-form"
          onSubmit={handleComment}
          style={{
            pointerEvents: replyToCommentId ? "none" : "auto",
            opacity: replyToCommentId ? 0.5 : 1,
          }}
        >
          <textarea
            className="comment-form-c-f"
            placeholder="Write a comment..."
            onChange={handleNewCommentInput}
            value={newComment}
            disabled={replyToCommentId !== null || isLoading}
          ></textarea>

          <button
            type="submit"
            className="submit-button comment-btn"
            disabled={
              isLoading ||
              newComment.trim().length === 0 ||
              replyToCommentId !== null
            }
          >
            {isLoading ? (
              <Oval
                visible={isLoading}
                height="15"
                width="15"
                color="#fff"
                ariaLabel="loading"
              />
            ) : (
              "Post Comment"
            )}
          </button>
        </form>
      </div>

      {showComments && (
        <div className="bm-comments-header">
          <h4 className="bm-comments-title">
            Comments{" "}
            <span className="bm-comments-count">{comments.length}</span>
          </h4>
          <div className="bm-comments-sort">⬆ Most recent</div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="bm-comments-c">
          {comments && comments.length > 0 ? (
            renderComments()
          ) : (
            <div className="bm-comments-c-null">
              <p>No Comments</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BlogComments;
