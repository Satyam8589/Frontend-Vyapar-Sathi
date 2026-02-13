import AuthForm from '@/features/auth/components/AuthForm';
import Image from 'next/image';

export default function AuthSignUpPage() {
  return (
    <div className='min-h-screen bg-slate-50 px-4 py-10 sm:py-12 lg:px-6'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-center'>
        <div className='w-full'>
          <div className='mb-8 text-center sm:mb-10'>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>VyaparSathi</h1>
          </div>

          <div className='grid w-full items-center gap-10 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-14'>
            <div className='order-2 lg:order-1'>
              <AuthForm mode="signup" />
            </div>

            <div className='order-1 hidden lg:flex lg:order-2 lg:justify-center'>
              <div className='w-full max-w-xl'>
                <div className='relative aspect-[5/4] overflow-hidden rounded-2xl bg-white'>
                  <Image
                    src='/images/auth/signUpImage.png'
                    alt='Take your shop into the digital age'
                    fill
                    priority
                    className='object-cover border border-slate-200 shadow-sm'
                  />
                </div>
                <div className='mt-4 space-y-2 text-center'>
                  <p className='text-base leading-6 text-slate-600'>Start with a secure account and set up your retail workflow quickly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
