'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdmin from "@/app/hooks/useAdmin";

export default function AdminRoute({ children }){
    const { isAdmin, isLoading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if( !isLoading && !isAdmin ){
            router.push('/unauthorized');
        }
    }, [isAdmin, isLoading, router]);

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
           <div className="loading loading-spinner loading-lg text-[#4d8d41]"></div>
      </div>
    );
    }
    if (!isAdmin) {
    return null;
  }
  return children
}