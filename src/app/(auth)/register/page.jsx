import RegisterUi from '@/app/components/authentication/register'
import Rightcontent from '@/app/components/authentication/Rightcontent'

const Register = () => {
  return (
    <main className="min-h-screen bg-[#ebe3e3] px-6 py-8 text-[#1f2a1d] sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-15rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-white/80 bg-white/70 shadow-xl shadow-[#6f8f67]/10 md:grid-cols-2">
        <RegisterUi />

        <div className="relative hidden min-h-full w-full overflow-hidden bg-[#dfe9dc] md:flex">
          <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-white/50 blur-3xl" />
          <Rightcontent />
        </div>
      </section>
    </main>
  )
}

export default Register
