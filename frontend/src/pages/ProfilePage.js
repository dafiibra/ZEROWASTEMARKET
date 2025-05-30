import React, { useState, useEffect, useRef } from 'react';
import { Button, Avatar, TextInput, Textarea, Modal } from 'flowbite-react';
import {
  HiOutlinePencilAlt,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiArrowRight
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslate } from '../utils/languageUtils';
import Footer from '../components/Footer';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    joinedAt: '',
    profilePicture: '',
  });

  // Language hooks
  const { language } = useLanguage();
  const translate = useTranslate(language);

  // State for change password modal
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // State for profile picture
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = 'https://zerowastemarket-production.up.railway.app';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Log what we're sending to help with debugging
      console.log('Sending data:', {
        full_name: userData.full_name,
        username: userData.username,
        phone: userData.phone,
        address: userData.address,
        bio: userData.bio
      });

      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          full_name: userData.full_name,
          username: userData.username,
          phone: userData.phone,
          address: userData.address,
          bio: userData.bio
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Response:', res.data);

      setUserData((prev) => ({
        ...prev,
        full_name: res.data.user.full_name,
        username: res.data.user.username,
        phone: res.data.user.phone,
        address: res.data.user.address,
        bio: res.data.user.bio,
        joinedAt: res.data.user.joinedAt,
      }));

      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Gagal memperbarui profil: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handler for changing password
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError(translate('passwordChange.currentRequired'));
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError(translate('passwordChange.newRequired'));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(translate('passwordChange.noMatch'));
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError(translate('passwordChange.minLength'));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordSuccess(translate('passwordChange.success'));

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error.response?.data || error.message);
      setPasswordError(error.response?.data?.message || translate('passwordChange.failed'));
    }
  };

  // Handler for profile picture
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!profileImage) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('profilePicture', profileImage);

      const res = await axios.post(
        `${API_URL}/api/users/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserData(prev => ({
        ...prev,
        profilePicture: res.data.profilePicture
      }));

      // Reset file input
      setProfileImage(null);
      alert('Foto profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error uploading profile picture:', error.response?.data || error.message);
      alert('Gagal mengupload foto profil: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Silakan login terlebih dahulu.');
          return;
        }
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile response:', res.data);
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Gagal memuat data profil.');
      }
    };
    fetchProfile();
  }, []);

  // Conditional render profile picture URL
  const profilePictureUrl = previewImage ||
    (userData.profilePicture ? `${API_URL}/${userData.profilePicture}` :
      'https://randomuser.me/api/portraits/men/32.jpg');

  return (
    <div className="min-h-screen bg-amber-50">
      <NavbarComponent />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{translate('profile.profile')}</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            {translate('profile.backToHome')}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-white p-6 text-black">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <Avatar
                  img={profilePictureUrl}
                  rounded
                  size="xl"
                />
                {isEditing && (
                  <button
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <HiOutlinePencilAlt className="h-5 w-5 text-amber-600" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </button>
                )}
              </div>
              <div>
                {isEditing ? (
                  <TextInput
                    name="full_name"
                    value={userData.full_name || ''}
                    onChange={handleInputChange}
                    className="text-2xl font-bold mb-1 bg-white/90 rounded"
                    placeholder={translate('auth.fullName')}
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{userData.full_name || userData.username}</h2>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {translate('profile.joinedSince')}{' '}
                  {userData.joinedAt &&
                    new Date(userData.joinedAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </p>

                {/* Show Upload button if image is selected and in edit mode */}
                {profileImage && isEditing && (
                  <Button
                    color="success"
                    size="sm"
                    className="mt-2"
                    onClick={handleUploadProfilePicture}
                  >
                    Upload Foto
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-t border-b border-gray-100">
            <Link
              to="/my-products"
              className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <HiOutlineShoppingBag className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="font-medium">{language === 'id' ? 'Produk Saya' : 'My Products'}</div>
                <p className="text-sm text-gray-500">{language === 'id' ? 'Kelola produk Anda' : 'Manage your products'}</p>
              </div>
              <HiArrowRight className="ml-auto text-amber-500" />
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <div className="p-2 bg-pink-100 rounded-lg">
                <HiOutlineHeart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="font-medium">{translate('common.myWishlist')}</div>
                <p className="text-sm text-gray-500">{language === 'id' ? 'Lihat wishlist Anda' : 'View your wishlist'}</p>
              </div>
              <HiArrowRight className="ml-auto text-pink-500" />
            </Link>

            <button
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <HiOutlineLockClosed className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{translate('profile.changePassword')}</div>
                <p className="text-sm text-gray-500">{language === 'id' ? 'Perbarui password Anda' : 'Update your password'}</p>
              </div>
              <HiArrowRight className="ml-auto text-blue-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <HiOutlineMail className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{translate('auth.email')}</h4>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiOutlinePhone className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{translate('profile.phone')}</h4>
                  {isEditing ? (
                    <TextInput
                      name="phone"
                      value={userData.phone || ''}
                      onChange={handleInputChange}
                      className="bg-white/90 rounded"
                      placeholder={translate('auth.phone')}
                    />
                  ) : (
                    <p className="text-gray-800">{userData.phone || '-'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <HiOutlineLocationMarker className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{translate('profile.address')}</h4>
                  {isEditing ? (
                    <TextInput
                      name="address"
                      value={userData.address || ''}
                      onChange={handleInputChange}
                      className="bg-white/90 rounded"
                      placeholder={translate('auth.address')}
                    />
                  ) : (
                    <p className="text-gray-800">{userData.address || '-'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start col-span-1 md:col-span-2">
                <HiOutlineDocumentText className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500">{translate('profile.bio')}</h4>
                  {isEditing ? (
                    <Textarea
                      name="bio"
                      value={userData.bio || ''}
                      onChange={handleInputChange}
                      className="bg-white/90 rounded w-full"
                      placeholder="Ceritakan tentang diri Anda"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800">{userData.bio || translate('profile.noBio')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <Button gradientDuoTone="amberToOrange" onClick={handleSave}>
                    {translate('profile.saveChanges')}
                  </Button>
                  <Button color="light" onClick={() => setIsEditing(false)}>
                    {translate('profile.cancel')}
                  </Button>
                </>
              ) : (
                <>
                  <Button gradientDuoTone="amberToOrange" onClick={() => setIsEditing(true)}>
                    <HiOutlinePencilAlt className="mr-2 h-5 w-5" />
                    {translate('profile.editProfile')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Change Password */}
      <Modal
        show={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        <Modal.Header>
          {translate('profile.changePassword')}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                {passwordSuccess}
              </div>
            )}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {translate('profile.currentPassword')}
              </label>
              <TextInput
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder={translate('profile.enterCurrentPassword')}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {translate('profile.newPassword')}
              </label>
              <TextInput
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder={translate('profile.enterNewPassword')}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {translate('profile.confirmNewPassword')}
              </label>
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={translate('profile.confirmNewPasswordPlaceholder')}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="amberToOrange"
            onClick={handleChangePassword}
          >
            {translate('profile.changePassword')}
          </Button>
          <Button
            color="gray"
            onClick={() => setPasswordModalOpen(false)}
          >
            {translate('profile.cancel')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default ProfilePage;