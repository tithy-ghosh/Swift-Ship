import Image from "next/image";

import appIcon from "@/app/icon.png";
import { mozilaHeadline } from "@/app/layout";



const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={appIcon}
        alt="SwiftShip logo"
        width={40}
        height={40}
        priority
        className="h-10 w-10    "
      />
      <h2 className={`${mozilaHeadline.className} text-2xl font-semibold`}>
        Swift
        <span className="text-[#83BD75]">Ship</span>
      </h2>
    </div>
  );
};

export default Logo;
