import Login from './components/login'
import DashBoard from './components/dashBoard'
import SymtptomChecker from './components/feature/symtptomChecker'
import MedicalSupport from './components/feature/medicalSupport'
import MedicalHistory from './components/feature/medicalHistory'
import Doctor from './components/feature/doctor'
import Profile from './components/feature/profile'
import HealthOnboarding from './components/HealthOnboarding'
import Navbar from './components/feature/navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="w-full flex-1 flex flex-col"
  >
    {children}
  </motion.div>
);

function App() {  
  const location = useLocation();

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-slate-50 font-sans ">
      {/* Animated Gradient Mesh Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-300/40 mix-blend-multiply filter blur-[120px] opacity-80 animate-blob border-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-300/40 mix-blend-multiply filter blur-[120px] opacity-80 animate-blob animation-delay-4000 border-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-violet-300/40 mix-blend-multiply filter blur-[120px] opacity-80 animate-blob animation-delay-6000 border-none"></div>
      <Navbar />
      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col border-none">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><DashBoard /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/symptom-checker" element={<PageWrapper><SymtptomChecker /></PageWrapper>} />
            <Route path="/find-doctor" element={<PageWrapper><Doctor /></PageWrapper>} />
            <Route path="/medical-support" element={<PageWrapper><MedicalSupport /></PageWrapper>} />
            <Route path="/health-history" element={<PageWrapper><MedicalHistory /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/onboarding" element={<PageWrapper><HealthOnboarding /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
