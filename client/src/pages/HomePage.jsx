import  {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/notes/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setNotes(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <p className="text-lg font-semibold text-gray-700 mb-4">You are logged into the home page!</p>

            <ul className="space-y-4">
                {notes.map(note => (
                    <li 
                        key={note.id} 
                        className="p-4 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
                    >
                        {note.body}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default HomePage
