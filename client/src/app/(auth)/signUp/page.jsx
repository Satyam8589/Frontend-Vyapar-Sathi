import AuthForm from '@/features/auth/components/AuthForm';
import Image from 'next/image';
import Background from '@/components/Background';
import Link from 'next/link';

export default function AuthSignUpPage() {
  return (
    <div className='min-h-screen lg:h-screen relative flex items-start lg:items-center justify-center selection:bg-blue-500/20 antialiased lg:overflow-hidden px-4 pt-6 pb-8 sm:pt-10 sm:pb-12 lg:py-0 lg:px-6'>
      <Background />
      <div className='relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center'>
        <div className='w-full py-2 lg:py-4'>
          <div className='mb-4 lg:mb-8 text-center'>
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <h1 className='text-3xl font-black tracking-tighter text-slate-900 sm:text-5xl uppercase'>
                VYAPAR<span className='text-gradient-yb italic'>SATHI</span>
              </h1>
            </Link>
          </div>

          <div className='grid w-full items-center gap-10 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-14'>
            <div className='order-2 lg:order-1'>
              <AuthForm mode="signup" />
            </div>

            <div className='order-1 hidden lg:flex lg:order-2 lg:justify-center'>
              <div className='w-full max-w-xl'>
                <div className='relative aspect-[5/4] overflow-hidden rounded-[2.5rem] border border-white/60 shadow-xl bg-white/20 backdrop-blur-sm'>
                  <Image
                    src='/images/auth/signUpImage.png'
                    alt='Take your shop into the digital age'
                    fill
                    priority
                    className='object-cover opacity-90'
                  />
                </div>
                <div className='mt-6 space-y-2 text-center'>
                  <p className='text-lg font-bold italic text-slate-600 leading-relaxed'>Deploy your store in minutes and scale with enterprise-grade retail tools.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
