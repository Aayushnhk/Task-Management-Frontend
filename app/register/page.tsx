// app/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className=" bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-linear-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Join us today
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Create your account to get started
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}