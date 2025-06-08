import { Link } from "react-router-dom";
import "../../styles/profileNotifications.css";

const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

export const ProfileNotificationCard = ({
  notification,
  selected,
  toggleSelect,
  selectMode,
}) => {
  const senderAvatar = notification.sender?.avatar_url;

  const getNotificationLink = () => {
    switch (notification.type) {
      case "like_blog":
      case "reply":
      case "like_comment":
      case "comment":
        return `/blogs/blog/${notification?.blog?._id}`;
      case "follow":
        return `/profile/${notification.sender?._id}`;
      default:
        return "#";
    }
  };

  const renderMessage = () => {
    switch (notification.type) {
      case "like_blog":
        return (
          <>
            <strong>{notification.sender?.name || "Someone"}</strong> liked your
            blog post.
          </>
        );
      case "comment":
        return (
          <>
            <strong>{notification.sender?.name || "Someone"}</strong> commented
            on your blog post.
          </>
        );
      case "reply":
        return (
          <>
            <strong>{notification.sender?.name || "Someone"}</strong> replied to
            your comment.
          </>
        );
      case "follow":
        return (
          <>
            <strong>{notification.sender?.name || "Someone"}</strong> started
            following you.
          </>
        );
      case "like_comment":
        return (
          <>
            <strong>{notification.sender?.name || "Someone"}</strong> liked your
            comment.
          </>
        );
      case "system":
        return notification.message || "System notification";
      default:
        return "You have a new notification.";
    }
  };

  return (
    <div
      className={`profile-notif-card ${
        notification.isRead ? "read" : "unread"
      } ${selected ? "selected" : ""}`}
    >
      {selectMode && (
        <input
          type="checkbox"
          className="notif-checkbox"
          checked={selected}
          onChange={() => toggleSelect(notification._id)}
          onClick={(e) => e.stopPropagation()} // prevent card link click
        />
      )}
      <Link
        to={getNotificationLink()}
        className="profile-notif-link"
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          textDecoration: "none",
        }}
      >
        <div className="profile-notif-avatar-c">
          <img src={senderAvatar} alt="Sender avatar" />
        </div>
        <div className="profile-notif-info">
          <p>{renderMessage()}</p>
          <span className="notif-time">{timeAgo(notification.createdAt)}</span>
        </div>
      </Link>
    </div>
  );
};