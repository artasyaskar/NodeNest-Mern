import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/apiService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const userData = {
        ...data,
        skills: data.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      const response = await userService.updateUser(user.id, userData);
      updateUser(response.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your personal information and preferences.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Personal Information</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className="form-input"
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className="form-input"
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="form-input bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed. Contact admin if needed.
              </p>
            </div>

            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                value={user?.username}
                disabled
                className="form-input bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Username cannot be changed. Contact admin if needed.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="form-input"
                placeholder="Tell us about yourself..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Brief description about yourself (max 500 characters)
              </p>
            </div>

            <div>
              <label htmlFor="skills" className="form-label">
                Skills
              </label>
              <input
                {...register('skills')}
                type="text"
                className="form-input"
                placeholder="JavaScript, React, Node.js, MongoDB..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your skills separated by commas
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Account Status</span>
              <span className="status-badge status-completed">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
