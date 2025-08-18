"use client"
import { Phone, File as FileIcon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient'

function CreateOptions() {

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!code.trim()) {
      toast.error('Please enter an interview code.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('Interviews')
      .select('interview_id')
      .eq('interview_id', code.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      toast.error('Invalid interview code. Please try again.');
      return;
    }

    toast.success('Redirecting to your interview...');
    router.push(`/interview/${code.trim()}`);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
  {/* Interview Code Card */}
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col h-full">
    <Phone className="p-2 text-blue-600 bg-blue-50 rounded-lg h-12 w-12" />
    <h2 className="mt-3 mb-2 font-semibold">Interview Code</h2>

    <Input
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Enter your code (UUID)"
      className="mb-2"
    />

    <p className="text-gray-500 text-sm mb-4">
      Get your code or link from your recruiter.
    </p>

    <div className="mt-auto">
      <Button onClick={handleStart} disabled={loading} className="w-full cursor-pointer">
        {loading ? 'Checking...' : 'Start'}
      </Button>
    </div>
  </div>

  {/* Upload CV Card */}
  <Link href={'/candidate/upload-cv'}>
    <div className='bg-white border border-gray-200 rounded-lg p-5 shadow-sm cursor-pointer flex flex-col h-full'>
      <FileIcon className='p-2 text-blue-600 bg-blue-50 rounded-lg h-12 w-12' />
      <h2 className="mt-3 font-semibold">Upload your CV</h2>
      <p className='text-gray-500 text-sm mb-4'>
        Create AI interviews and schedule them with candidates
      </p>
      <div className="mt-auto">
        <div className="w-full h-[40px]"></div> {/* Spacer to match button height */}
      </div>
    </div>
  </Link>
</div>
  )
}

export default CreateOptions