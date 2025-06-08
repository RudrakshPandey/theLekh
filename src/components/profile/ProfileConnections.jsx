import "../../styles/ProfileConnections.css";
import ProfileConnectionCard from "./ProfileConnectionCard";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import ProfileConnectionSkeleton from "../ui/skeletons/ProfileConnectionSkeleton";
import { FiSearch } from "react-icons/fi";

const ProfileConnections = ({ user }) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { token } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("followers");
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get(`${base_url}/users/${user._id}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${base_url}/users/${user._id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setFollowers(followersRes.data.followers);
      setFollowing(followingRes.data.following);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const list = activeTab === "followers" ? followers : following;
    const filtered = list.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, activeTab, followers, following]);

  if (isLoading) return <ProfileConnectionSkeleton />;

  return (
    <div className="connections-container">
      <div className="connections-header">
        <div className="connections-left">
          <div className="toggle-wrapper">
            <div
              className="toggle-indicator"
              style={{
                transform:
                  activeTab === "followers"
                    ? "translateX(0%)"
                    : "translateX(100%)",
              }}
            />
            <button
              className={`toggle-tab ${
                activeTab === "followers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`toggle-tab ${
                activeTab === "following" ? "active" : ""
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>

        <div className="connections-right">
          <div className="search-bar-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeTab}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
          </div>
        </div>
      </div>
      {filteredList.length > 0 ? (
        <div className="card-grid">
          {filteredList.map((person, index) => (
            <ProfileConnectionCard data={person} key={index} />
          ))}
        </div>
      ) : (
        <p className="no-connections">{`No ${activeTab} found.`}</p>
      )}
    </div>
  );
};

export default ProfileConnections;
