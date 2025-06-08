import ProfileComponent from '../../components/profile/ProfileComponent';
import { useContext, useEffect, useState } from 'react';
import '../../styles/profile.css';
import AuthContext from '../../context/AuthContext';
import ProfileTabs from '../../components/profile/ProfileTabs';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import ProfileSkeleton from '../../components/ui/skeletons/ProfileSkeleton';
import ConfirmModal from '../../components/ui/ConfirmModal';

const UsersProfilePage = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getUserData = async () => {
    try {
      const res = await axios.get(`${base_url}/users/profile/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate('/user-not-found');
    }
  };

  const handleAdminDelete = async () => {
    try {
      await axios.delete(`${base_url}/users/admin/delete-user/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully.');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user.');
    } finally {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [params]);

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <Helmet>
        <title>{user?.name} | Profile | the Lekh</title>
      </Helmet>
      <div className='user-profile-container'>
        <ProfileComponent
          user={user}
          triggerDelete={() => setShowConfirmModal(true)}
        />
        <ProfileTabs user={user} />
      </div>
        
      <ConfirmModal
          isOpen={showConfirmModal}
          title="Delete User?"
          message={`Are you sure you want to delete ${user.name}'s account?`}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleAdminDelete}
        />
    </>
  );
};

export default UsersProfilePage;
