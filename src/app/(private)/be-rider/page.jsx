'use client';

import useAuth from '@/app/hooks/useAuth';
import BeARiderForm from '@/app/components/riders/BeARiderForm';
import Link from 'next/link';

export default function BeARiderPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-brand-content">Access Denied</h1>
        <p className="mt-2 text-brand-content-muted">You must be logged in to apply as a rider.</p>
        <Link href="/login" className="mt-6 btn bg-brand-accent-bright text-brand-surface-inverse-deep">Go to Login</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface-muted  px-4">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-content">Join the SwiftShip Fleet</h1>
        <p className="mt-2 text-brand-content-muted">Fill out the form below to start your journey as a delivery partner.</p>
      </div>
      <BeARiderForm />
    </main>
  );
}