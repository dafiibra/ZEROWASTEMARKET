import React, { useState, useEffect } from 'react';
import { Button, Avatar, TextInput, Textarea } from 'flowbite-react';
import { HiOutlinePencilAlt, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineDocumentText } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import axios from 'axios';

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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
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
        'http://localhost:5000/api/users/profile',
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Silakan login terlebih dahulu.');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/users/profile', {
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

  return (
    <div className="min-h-screen bg-amber-50">
      <NavbarComponent />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-white p-6 text-black">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <Avatar
                  img="https://randomuser.me/api/portraits/men/32.jpg"
                  rounded
                  size="xl"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                    <HiOutlinePencilAlt className="h-5 w-5 text-amber-600" />
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
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{userData.full_name || userData.username}</h2>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Bergabung sejak:{' '}
                  {userData.joinedAt &&
                    new Date(userData.joinedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <HiOutlineMail className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiOutlinePhone className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Telepon</h4>
                  {isEditing ? (
                    <TextInput
                      name="phone"
                      value={userData.phone || ''}
                      onChange={handleInputChange}
                      className="bg-white/90 rounded"
                      placeholder="Nomor Telepon"
                    />
                  ) : (
                    <p className="text-gray-800">{userData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <HiOutlineLocationMarker className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Alamat</h4>
                  {isEditing ? (
                    <TextInput
                      name="address"
                      value={userData.address || ''}
                      onChange={handleInputChange}
                      className="bg-white/90 rounded"
                      placeholder="Alamat"
                    />
                  ) : (
                    <p className="text-gray-800">{userData.address}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start col-span-1 md:col-span-2">
                <HiOutlineDocumentText className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500">Bio</h4>
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
                    <p className="text-gray-800">{userData.bio || 'Belum ada bio'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <Button gradientDuoTone="amberToOrange" onClick={handleSave}>
                    Simpan Perubahan
                  </Button>
                  <Button color="light" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <Button gradientDuoTone="amberToOrange" onClick={() => setIsEditing(true)}>
                    <HiOutlinePencilAlt className="mr-2 h-5 w-5" />
                    Edit Profil
                  </Button>
                  <Button color="blue">Ganti Password</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;