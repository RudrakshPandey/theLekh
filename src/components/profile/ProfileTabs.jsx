import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ProfileDetails from "./ProfileDetails";
import ProfileBlogs from "./ProfileBlogs";
import ProfileConnections from "./ProfileConnections";
import ProfileNotifications from "./ProfileNotifications";
import "../../styles/profiletabs.css";

const ProfileTabs = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const { unreadCount, notifications, clearNotifications, fetchNotifications } =
    useContext(AuthContext);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === "notifications") {
      await fetchNotifications(); // mark as read only when viewed
      setTimeout(() => clearNotifications(), 1000); // slight delay to simulate reading
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileDetails user={user} />;
      case "blogs":
        return <ProfileBlogs user={user} />;
      case "connections":
        return <ProfileConnections user={user} />;
      case "notifications":
        return (
          <ProfileNotifications user={user} notifications={notifications} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-tabs">
      <div className="p-tabs-container">
        <button
          onClick={() => handleTabChange("profile")}
          className={`${activeTab === "profile" && "active"} p-tabs-btn`}
        >
          profile
        </button>
        <button
          onClick={() => handleTabChange("blogs")}
          className={`${activeTab === "blogs" && "active"} p-tabs-btn`}
        >
          blogs
        </button>
        <button
          onClick={() => handleTabChange("notifications")}
          className={`${activeTab === "notifications" && "active"} p-tabs-btn`}
          style={{ position: "relative" }}
        >
          Notifications
          {unreadCount > 0 && activeTab !== "notifications" && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 5,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "red",
              }}
            />
          )}
        </button>
        <button
          onClick={() => handleTabChange("connections")}
          className={`${activeTab === "connections" && "active"} p-tabs-btn`}
        >
          connections
        </button>
      </div>
      <div>{renderTab()}</div>
    </div>
  );
};

export default ProfileTabs;
