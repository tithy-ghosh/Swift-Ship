import Image from "next/image";

import appIcon from "@/app/assets/icon.png";
import { mozilaHeadline } from "@/app/layout";



const Logo = () => {
  return (
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
  );
};

export default Logo;
