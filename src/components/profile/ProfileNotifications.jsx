import { useContext, useEffect, useState } from "react";
import { ProfileNotificationCard } from "./profileNotificationsCard";
import "../../styles/profileNotifications.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const ProfileNotifications = () => {
  const { notifications, fetchNotifications, token } = useContext(AuthContext);
  const [selected, setSelected] = useState([]);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchNotifications?.();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    for (let id of selected) {
      await axios.delete(`${base_url}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setSelected([]);
    fetchNotifications?.();
  };

  const deleteAll = async () => {
    await axios.delete(`${base_url}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelected([]);
    fetchNotifications?.();
  };

  const markAllRead = async () => {
    await axios.put(
      `${base_url}/notifications/mark-all-read`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchNotifications?.();
  };

  if (!notifications || notifications.length === 0) {
    return <p className="no-notifs">No notifications yet.</p>;
  }

  return (
    <div className="profile-notifications-c">
      <div className="notif-actions">
        <button
          onClick={() => {
            if (selectMode) setSelected([]); // clear selection on cancel
            setSelectMode(!selectMode);
          }}
          className="notif-btn"
        >
          {selectMode ? "Cancel" : "Select"}
        </button>
        <button onClick={markAllRead} className="notif-btn">
          Mark All as Read
        </button>
        {selectMode && (
          <button onClick={deleteSelected} className="notif-btn">
            Delete Selected
          </button>
        )}
        <button onClick={deleteAll} className="notif-btn">
          Delete All
        </button>
      </div>
      {notifications.map((notif) => (
        <ProfileNotificationCard
          key={notif._id}
          notification={notif}
          selected={selected.includes(notif._id)}
          toggleSelect={toggleSelect}
          selectMode={selectMode}
        />
      ))}
    </div>
  );
};

export default ProfileNotifications;
