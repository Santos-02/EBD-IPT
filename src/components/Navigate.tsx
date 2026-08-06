import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import Image from '../assets/image.jpg'

export default function Navigate() {
  const navigate = useNavigate()
  const { logout } = useAuth() as { logout: () => Promise<void> }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="navigate">
        <div className="navigate-logo">
            <img src={Image} alt="Logo" style={{ width: '100px'}} />
        </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}