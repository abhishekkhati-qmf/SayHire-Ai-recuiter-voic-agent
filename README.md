# SayHire – AI Recruiter Voice Agent  

SayHire is an **AI-powered voice recruitment agent** designed to automate candidate screening and streamline the hiring process.  
Built with **Next.js**, **React**, **Vapi API**, and **Supabase**, it enables **real-time, natural voice conversations** that simulate human recruiters using intelligent prompt chaining.  
Supabase is used for authentication and real-time session storage, allowing **dynamic candidate management**, while the **Paddle payment gateway** is integrated for secure and seamless transactions.  

## 🚀 Deployment

You can check out the live app here: [Live Demo](https://skill-verse-front-end-f5pu.vercel.app/)

## 📸 Screenshots

### Homepage
![SayHire Homepage](public/Home.png)

## 🚀 Features

### For Recruiters
- **AI-Powered Interview Creation**: Generate personalized interview questions based on job requirements
- **Voice-Based Interviews**: Conduct automated interviews using VAPI AI voice agents
- **Real-time Feedback**: Get instant AI-generated feedback and scoring for candidates
- **Credit System**: Pay-per-interview model with flexible credit packages
- **Dashboard Analytics**: Track interview performance and candidate metrics
- **User Management**: Manage candidates, view results, and export data

### For Candidates
- **Seamless Interview Experience**: Join interviews via unique links
- **Voice Interaction**: Natural conversation with AI interviewer
- **Instant Feedback**: Receive detailed feedback and scoring immediately
- **Profile Management**: Upload CV, manage personal information
- **Interview History**: View past interviews and results

### For Administrators
- **User Management**: Ban/unban users, manage accounts
- **System Monitoring**: View all interviews and system statistics
- **Data Export**: Export user and interview data
- **Platform Control**: Full administrative control

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Google OAuth, email/password)
  - Real-time subscriptions
  - File storage

### AI & Voice
- **VAPI AI** - Voice agent platform
- **OpenAI/DeepSeek** - AI question generation and feedback
- **OpenRouter** - AI model routing
- **Deepgram** - Speech-to-text
- **PlayHT** - Text-to-speech

### Additional Tools
- **paddle** - Payment gateway to buy credits
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **React Dropzone** - File uploads
- **Moment.js** - Date handling
- **UUID** - Unique identifiers

## 📁 Project Structure

```
ai-recruiter-voice-agent/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── recruiter/           # Recruiter dashboard
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── create-interview/ # Interview creation
│   │   │   ├── all-interview/   # Interview management
│   │   │   ├── billing/         # Credit management
│   │   │   └── profile/         # User profile
│   │   └── candidate/           # Candidate dashboard
│   │       ├── dashboard/       # Candidate dashboard
│   │       ├── interviews/      # Interview history
│   │       └── profile/         # Profile management
│   ├── interview/               # Interview flow
│   │   └── [interview_id]/      # Dynamic interview routes
│   ├── admin/                   # Admin panel
│   ├── api/                     # API routes
│   │   ├── ai-model/           # AI question generation
│   │   ├── ai-feedback/        # AI feedback generation
│   │   ├── payment/            # paddle payment gateway setup
│   │   ├── webhook/            # webhook verification of payment
│   │   └── admin/              # Admin APIs
│   ├── auth/                   # Authentication
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── ui/                     # UI components (shadcn/ui)
│   ├── login-form.jsx          # Login component
│   └── register-form.jsx       # Registration component
├── context/                    # React contexts
├── lib/                        # Utility libraries
├── services/                   # External services
│   ├── Constants.jsx          # App constants
│   └── supabaseClient.js      # Supabase client
├── hooks/                      # Custom React hooks
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- VAPI AI account
- OpenAI/OpenRouter API key
- paddle payment gateway

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/devpayoub/AI-Recruitment-Agent.git
cd ai-recruiter-voice-agent
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Variables**
Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
OPENROUTER_API_KEY=your_openrouter_api_key
VAPI_API_KEY=your_vapi_api_key

#Paddle payment gateway setup
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
PADDLE_SECRET_TOKEN=your_paddle_secret_token
WEBHOOK_SECRET_KEY=your_webhook_secret_key

# Optional
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_HOST_URL=http://localhost:3000/interview    
```

4. **Database Setup**
Run the following SQL in your Supabase SQL editor:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  role VARCHAR DEFAULT 'candidate',
  picture VARCHAR,
  credits INTEGER DEFAULT 3,
  banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interviews table
CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  interview_id VARCHAR UNIQUE NOT NULL,
  userEmail VARCHAR NOT NULL,
  jobPosition VARCHAR,
  jobDescription TEXT,
  duration VARCHAR,
  type VARCHAR,
  questionList JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interview results table
CREATE TABLE interview_results (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR,
  email VARCHAR,
  interview_id VARCHAR,
  conversation_transcript JSONB,
  recommendations VARCHAR,
  completed_at TIMESTAMP DEFAULT NOW()
);

--paddle transcation table
CREATE TABLE paddle_transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT4 NOT NULL,
    txn_id TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL,
    credits NUMERIC NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features Explained

### AI-Powered Interview Generation
- Uses OpenAI/DeepSeek to generate contextual interview questions
- Questions are tailored to job position, description, and duration
- Supports multiple interview types (Technical, Behavioral, Experience, etc.)

### Voice-Based Interviews
- Integrates VAPI AI for natural voice conversations
- Real-time speech-to-text and text-to-speech
- Automatic conversation recording and analysis

### Smart Feedback System
- AI analyzes interview conversations
- Provides detailed scoring across multiple dimensions:
  - Technical Skills
  - Communication
  - Problem Solving
  - Experience
  - Behavioral
  - Analysis
- Generates hiring recommendations

### Credit System
- Pay-per-interview model
- Buy credits using paddle payment gateway
- Flexible credit packages
- Automatic credit deduction
- Billing integration

## 🔐 Authentication

The app supports multiple authentication methods:
- **Email/Password**: Traditional registration and login
- **Google OAuth**: One-click Google sign-in
- **Role-based Access**: Separate dashboards for recruiters, candidates, and admins

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant components
- **Dark Mode**: Theme support (if implemented)
- **Animations**: Smooth transitions and micro-interactions

## 📊 Analytics & Reporting

- **Interview Analytics**: Track performance metrics
- **Candidate Scoring**: Detailed evaluation reports
- **Export Functionality**: CSV export for data analysis
- **Real-time Updates**: Live dashboard updates

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable authentication with Google OAuth
3. Set up the database tables
4. Configure RLS policies

### VAPI AI Setup
1. Create a VAPI account
2. Configure voice agents
3. Set up webhooks for conversation handling

### paddle payment gateway setup
1. Get Clinet token and paddle secret token 
2. set webhook url and generate webhook secret key
3. run a webhook simulation 

### OpenAI/OpenRouter Setup
1. Get API keys from OpenRouter
2. Configure model preferences
4. Set up rate limiting

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support, email abhishekkhati0309@gmail.com.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [VAPI AI](https://vapi.ai/) - Voice agent platform
- [OpenAI](https://openai.com/) - AI models
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components

---
