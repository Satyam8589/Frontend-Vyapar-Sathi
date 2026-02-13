import AuthForm from '@/features/auth/components/AuthForm';
import Image from 'next/image';

export default function AuthLoginPage() {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      {/* Form Section */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-4 py-10 bg-slate-50'>
        <div className='w-full max-w-md'>
          <AuthForm mode="login" />
        </div>
      </div>
      
      {/* Image Section */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='relative z-10 text-center text-white space-y-6'>
          <div className='relative w-full h-[500px] mb-8'>
            <Image
              src='/images/auth/loginImage.png'
              alt='Login illustration'
              fill
              className='object-contain drop-shadow-2xl'
              priority
            />
          </div>
          <h2 className='text-4xl font-bold drop-shadow-lg'>
            Welcome to VyaparSathi
          </h2>
          <p className='text-xl text-blue-100 max-w-md mx-auto'>
            Your trusted partner for seamless business management and growth
          </p>
        </div>
      </div>
    </div>
  );
}
