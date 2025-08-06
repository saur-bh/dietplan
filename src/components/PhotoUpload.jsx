import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { CameraIcon } from '@heroicons/react/24/outline';

const PhotoUpload = ({ userId, onPhotoUploaded, existingPhotoUrl }) => {
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(existingPhotoUrl || '');
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const storageRef = ref(storage, `user_photos/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoUrl(url);
      setPhoto(file);
      onPhotoUploaded && onPhotoUploaded(url);
    } catch (err) {
      setError('Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block"
        />
        {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
        {photoUrl && (
          <img src={photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
        )}
        {!photoUrl && <CameraIcon className="w-10 h-10 text-gray-300" />}
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};

export default PhotoUpload;
