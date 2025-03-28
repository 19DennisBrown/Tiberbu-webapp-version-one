import {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return (
            <div className="flex items-center gap-4 p-4 bg-gray-100 shadow-md">
                <Link to="/" className="text-blue-500 hover:underline font-semibold">Home</Link>
                <span className="text-gray-500">|</span>
                
                {user ? (
                    <p 
                        onClick={logoutUser} 
                        className="text-red-500 cursor-pointer hover:underline font-semibold"
                    >
                        Logout
                    </p>
                ) : (
                    <div className=' flex gap-4'>
                        <Link to="/login" className="text-blue-500 hover:underline font-semibold">
                            Login
                        </Link>
                        <Link to="/register" className="text-violet-500 hover:underline font-semibold">
                            Signup
                        </Link>
                    </div>
                )}

                {user && <p className="text-gray-700 font-medium">Hello, {user.username}</p>}
            </div>

    )
}

export default Header
