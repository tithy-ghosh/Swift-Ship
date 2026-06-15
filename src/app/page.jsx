import Homepage from "@/app/ui/Homepage";
import Navbar from "@/app/ui/Navbar";
import Footer from "./ui/Footer";



const Home = () => {
 
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#ebe3e3]">
      <Navbar />
      <main className="pb-14 pt-24 sm:pb-20 sm:pt-28">
        <Homepage />
      </main>
      <Footer />
    </div>
  )
}

export default Home
