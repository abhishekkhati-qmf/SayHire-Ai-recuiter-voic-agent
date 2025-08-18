'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Star, CheckCircle, Clock, VerifiedIcon } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';

export default function RecentInterviews() {
  const { user } = useUser();
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentInterviews();
    }
  }, [user]);

  const fetchRecentInterviews = async () => {
    try {
      setLoading(true);
      
      // Fetch recent interview results for this candidate (limit to 3)
      const { data: results, error } = await supabase
        .from('interview_results')
        .select(`
          *,
          Interviews (
            jobPosition,
            jobDescription,
            type,
            duration,
            created_at
          )
        `)  
        .eq('email', user.email)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent interviews:', error);
        return;
      }

      setRecentInterviews(results || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (feedback) => {
    if (!feedback?.rating) return 'N/A';
    
    const ratings = Object.values(feedback.rating).filter(val => typeof val === 'number');
    if (ratings.length === 0) return 'N/A';
    
    const average = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    return `${average}/10`;
  };

  const getScoreColor = (score) => {
    if (score === 'N/A') return 'bg-gray-100 text-gray-600';
    const numScore = parseInt(score);
    if (numScore >= 8) return 'bg-green-100 text-green-700';
    if (numScore >= 6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Recent Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Recent Interviews
          </CardTitle>
          {recentInterviews.length > 0 && (
            <Link href="/candidate/interviews">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentInterviews.length === 0 ? (
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No interviews yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Your interview history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInterviews.map((result, index) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">
                      {result.Interviews?.jobPosition || 'Interview'}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {result.Interviews?.type || 'Interview'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {moment(result.created_at).format('MMM DD')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.Interviews?.duration || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {result.status === 'completed' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {result.conversation_transcript?.feedback && (
                        <Badge 
                          className={`text-xs ${getScoreColor(calculateOverallScore(result.conversation_transcript.feedback))}`}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {calculateOverallScore(result.conversation_transcript.feedback)}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <VerifiedIcon className="w-4 h-4 text-yellow-500" />
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 