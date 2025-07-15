import { nanoid } from "nanoid";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
    const navigate = useNavigate();
    const handleClick = ()=>{
        const roomId = nanoid(8);
        navigate(`/${roomId}`);
    }

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-white">
      <div className="absolute -top-32 -left-32 w-80 h-80 md:w-96 md:h-96 bg-[#b798ff] rounded-full filter blur-3xl opacity-70 mix-blend-multiply animate-pulse" />
      <div className="absolute -bottom-20 left-0 w-80 h-80 md:w-96 md:h-96 bg-[#66ccff] rounded-full filter blur-3xl opacity-70 mix-blend-multiply animate-pulse" />
      <div className="absolute -top-32 -right-32 w-80 h-80 md:w-96 md:h-96 bg-[#99ccff] rounded-full filter blur-3xl opacity-70 mix-blend-multiply animate-pulse" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 md:w-96 md:h-96 bg-[#cc99ff] rounded-full filter blur-3xl opacity-70 mix-blend-multiply animate-pulse" />

      <Sidebar/>

      <main className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-20 md:pt-12 md:pb-24 z-10 h-[calc(100vh-6rem)] relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black flex flex-wrap flex-col justify-center items-center gap-2 leading-tight">
          <span>⚡Share Code Instantly,</span>
          <span>Collaborate Effortlessly</span>
        </h2>
        <p className="mt-4 text-gray-700 text-sm sm:text-base max-w-xl">
          No login. No hassle. Just visit{" "}
          <span className="font-medium">
            codetogether.net/[anything you type]
          </span>
          .
        </p>
        <button className="mt-6 px-6 py-3 bg-[#2A73FF] text-white rounded-md font-medium shadow-lg hover:bg-blue-600 hover:scale-105 active:scale-95 transition duration-200 cursor-pointer" onClick={handleClick}>
          Share Code Now!
        </button>
      </main>
    </div>
  );
}
