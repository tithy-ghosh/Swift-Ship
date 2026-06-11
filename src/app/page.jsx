import Homepage from "@/app/ui/Homepage";
import Navbar from "@/app/ui/Navbar";
import Footer from "./ui/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#ebe3e3]">
      <Navbar />
      <main className="py-28">
        <Homepage />
      </main>
      <Footer />
    </div>
  )
}

export default Home
