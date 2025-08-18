'use client';
import { useState, useEffect } from 'react';
import Dropzone from 'shadcn-dropzone';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';


export default function UploadCV() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
  
      if (error || !session) {
        toast.error('User not logged in');
        return;
      }
  
      const userEmail = session.user.email;
  
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, cv_file_path')
        .eq('email', userEmail)
        .single();
  
      if (userError) {
        console.error('Failed to fetch user:', userError);
        toast.error('Failed to load user data');
        return;
      }
  
      setUser(userData);
    }
  
    fetchUser();
  }, []);


  // Handle file drop
  const handleFileDrop = (files) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      console.log('Selected CV:', files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      toast.error('Please upload your CV before submitting.');
      return;
    }
    if (!user) {
      toast.error('User not loaded.');
      return;
    }

    setLoading(true);

    try {
      // Define storage path
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `cv.${fileExt}`;
      const filePath = `cv/${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, uploadedFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Update user record with file path
      const { error: updateError } = await supabase
        .from('users')
        .update({ cv_file_path: filePath })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh user data to update UI
      setUser({ ...user, cv_file_path: filePath });
      setUploadedFile(null);
      toast.success('CV uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload CV.');
    } finally {
      setLoading(false);
    }
  };

  // Delete CV file from storage and DB
  const handleDelete = async () => {
    if (!user || !user.cv_file_path) return;

    setLoading(true);
    try {
      const { error: deleteError } = await supabase.storage
        .from('cv-uploads')
        .remove([user.cv_file_path]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ cv_file_path: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser({ ...user, cv_file_path: null });
      toast.success('CV deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete CV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {!user ? (
          <p>Loading user...</p>
        ) : user.cv_file_path ? (
          <div>
           <div className="flex items-center gap-3 mb-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4m4 0a2 2 0 004-2m-4 2a2 2 0 01-4-2"
    />
  </svg>
  <span className="text-gray-800 font-medium">CV Uploaded</span>
</div>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete CV'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your CV (PDF)
              </label>

              <Dropzone
                onDropAccepted={handleFileDrop}
                accept={{ 'application/pdf': ['.pdf'] }}
                maxFiles={1}
              />

              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected file: {uploadedFile.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload CV'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}