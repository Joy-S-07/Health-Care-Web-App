import Login from './components/login'
import DashBoard from './components/dashBoard'
import SymtptomChecker from './components/feature/symtptomChecker'
import MedicalSupport from './components/feature/medicalSupport'
import MedicalHistory from './components/feature/medicalHistory'
import Doctor from './components/feature/doctor'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {  
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/symptom-checker" element={<SymtptomChecker />} />
        <Route path="/find-doctor" element={<Doctor />} />
        <Route path="/medical-support" element={<MedicalSupport />} />
        <Route path="/health-history" element={<MedicalHistory />} />
      </Routes>
    </div>
  )
}

export default App
