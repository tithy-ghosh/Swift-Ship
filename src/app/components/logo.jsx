import Image from "next/image";
import { Mozilla_Headline } from "next/font/google";

import appIcon from "@/app/assets/icon.png";
import Link from "next/link";


const mozilaHeadline = Mozilla_Headline({
  subsets: ["latin"],
});

const Logo = () => {
  return (
   <Link href='/'>
     <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <Image
        src={appIcon}
        alt="SwiftShip logo"
        width={40}
        height={40}
        priority
        className="h-9 w-9 sm:h-10 sm:w-10"
      />
      <h2 className={`${mozilaHeadline.className} text-xl font-semibold sm:text-2xl`}>
        Swift
        <span className="text-[#83BD75]">Ship</span>
      </h2>
    </div>

   </Link>
  );
};

export default Logo;
