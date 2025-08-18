'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Sparkles, BarChart2, Clock, Check, Search, FileText, ShieldCheck, Award } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ hires: 0, matches: 0, accuracy: 0 });

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) console.error(error.message);
  };

  const handleStartRecruiting = () => router.push('/login');

  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') router.push('/recruiter/dashboard');
      else if (user.role === 'candidate') router.push('/candidate/dashboard');
    }
  }, [user, router]);

  const testimonials = [
    { quote: "Intuitive front-end and seamless backend integration.", author: "Abhishek Narvariya", image: "/user Photos/An.jpg", role: "Node js Developer , Creative Thoughts Informatics Services Pvt,Indore" },
    { quote: "Built with security at its core, smooth performance.", author: "Devvrat Kannojia", image: "/user Photos/Dk.jpg", role: "Machine Learning Engineer, CreateBytes , Gurgaon" },
    { quote: "TalentAI transformed our hiring process – faster decisions, better candidates, and happier teams!", author: "Avinash Dharme", image: "/user Photos/AD.jpg", role: "Software Engineer , NSquare Xperts Pune" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCounters({
        hires: Math.floor(progress * 85),
        matches: Math.floor(progress * 320 / 10), // 3.2x
        accuracy: Math.floor(progress * 95),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const clientLogos = [
    "/clientLogos/tata.png",
    "/clientLogos/techmahindra.png",
    "/clientLogos/eeshanya.png",
    "/clientLogos/hrh.jpeg",
    "/clientLogos/google.png",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/30 relative overflow-hidden">

      {/* Floating Shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-72 h-72 rounded-full bg-blue-200/20 blur-3xl animate-float-slow top-1/4 left-1/4"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-200/20 blur-3xl animate-float-medium bottom-1/3 right-1/5"></div>
        <div className="absolute w-56 h-56 rounded-full bg-indigo-200/15 blur-3xl animate-float-fast top-1/3 right-1/3"></div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 lg:px-20 py-24 flex flex-col-reverse lg:flex-row items-center gap-16">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Smarter Hiring <span className="text-blue-600">Powered by AI</span>
          </h1>
          <p className="text-lg text-gray-600">
            Transform your recruitment with intelligent candidate matching, automated screening, and actionable insights that save time and improve quality.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3" onClick={handleStartRecruiting}>
              Start Recruiting <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button className="bg-white border border-gray-200 text-gray-700 px-6 py-3" onClick={signInWithGoogle}>
              Sign in with Google
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:w-1/2 flex justify-center relative">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-3xl shadow-2xl flex items-center justify-center">
            <Brain className="w-32 h-32 text-white animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 lg:px-20 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[{ value: counters.hires + "%", label: "Reduction in time-to-hire", icon: Clock },
          { value: counters.matches + "x", label: "Better candidate matches", icon: Check },
          { value: counters.accuracy + "%", label: "Accuracy rate", icon: BarChart2 }
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.2 }} className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 text-center hover:scale-105 transition-transform">
            <stat.icon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 lg:px-20 py-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[{ title: "AI Candidate Matching", desc: "Match candidates to jobs accurately.", icon: Brain },
            { title: "Automated Screening", desc: "Intelligent parsing & scoring of resumes.", icon: FileText },
            { title: "Analytics Dashboard", desc: "Track hiring metrics in real-time.", icon: BarChart2 },
            { title: "Bias Reduction", desc: "Structured evaluations minimize unconscious bias.", icon: ShieldCheck },
            { title: "Candidate Engagement", desc: "Automated messages keep candidates informed.", icon: Sparkles },
            { title: "Employer Branding", desc: "Showcase your culture and values.", icon: Award },
          ].map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: Math.floor(idx / 3) * 0.2 }} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-start gap-4 hover:shadow-2xl hover:scale-105 transition-transform">
              <feature.icon className="w-10 h-10 text-blue-500 mb-2" />
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto pb-20">
       <div className="w-full max-w-5xl mx-auto mt-32 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Trusted by HR Teams Worldwide</h2>
              <p className="text-blue-100 mb-8">
                Join thousands of companies who have transformed their hiring with TalentAI
              </p>
            </div>
            
            <div className="p-7">
              <div className="relative h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                  >
                    <div className="flex flex-col h-full justify-center">
                      <div className="text-2xl font-oswald font- text-gray-800 mb-6 leading-relaxed">
                        "{testimonials[currentTestimonial].quote}"
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                          {/* Replace with actual avatar image */}
                          {testimonials[currentTestimonial].image ? (
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].author}
                  width={40}
                  height={40}
                  className=" w-full h-full object-cover "
                />
              ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                            {testimonials[currentTestimonial].author.charAt(0)}
                          </div>
              )} 
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{testimonials[currentTestimonial].author}</div>
                          <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].role}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-0 left-0 space-x-2  ">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full ${currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float-slow {0%,100%{transform:translateY(0)}50%{transform:translateY(-20px) translateX(10px)}}
        @keyframes float-medium {0%,100%{transform:translateY(0)}50%{transform:translateY(-15px) translateX(-15px)}}
        @keyframes float-fast {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px) translateX(5px)}}
        .animate-float-slow {animation:float-slow 8s ease-in-out infinite;}
        .animate-float-medium {animation:float-medium 6s ease-in-out infinite;}
        .animate-float-fast {animation:float-fast 4s ease-in-out infinite;}
      `}</style>
    </div>
  );
}              