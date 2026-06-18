
import Image from 'next/image'
import loginBanner from '@/app/assets/loginbanner.png'
import { MdVerified } from 'react-icons/md'
const Rightcontent = () => {
  return (
    <div className="relative z-10 flex h-full w-full flex-col px-5 py-8 sm:px-8 lg:px-12">
                <div className="mb-8 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#31542b] shadow-sm">
                  <MdVerified className="size-5 text-[#4d8d41]" />
                  Trusted city-wide delivery
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <Image
                    src={loginBanner}
                    alt="SwiftShip courier delivery"
                    className="h-full w-full scale-[1.5] object-contain"
                    priority
                  />
                </div>
              </div>
  )
}

export default Rightcontent
