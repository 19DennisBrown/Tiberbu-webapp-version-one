import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import PropTypes from 'prop-types';

const Chat = ({ chatInfo, patientData }) => {
  const { user, authTokens } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [physicianID, setPhysicianID] = useState();
  const [patientID, setPatientID] = useState();

  useEffect(() => {

    // Physician id options
    const physicianIdFromChat = chatInfo?.supervisor?.user?.id;
    const phycisianIdFromPatient = patientData?.patient?.physician?.user.id;

    // patients id options
    const patientIdFromChat = chatInfo;
    const patientIdFromPatient = patientData?.patient?.user?.id;

    // console.log("Fetching ChatInfo: ", ChatInfo )

    setPhysicianID(physicianIdFromChat || phycisianIdFromPatient);
    setPatientID(patientIdFromChat || patientIdFromPatient);
  }, [chatInfo, patientData]);

  useEffect(() => {
    if (!user || !authTokens) {
      setError('Authentication required.');
      setLoading(false);
      return;
    }

    const patient_id = user.role === 'patient' ? user.user_id : patientID;
    const physician_id = user.role === 'physician' ? user.user_id : physicianID;

    if (!patient_id || !physician_id) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const url = `http://localhost:8000/chat/chat_messages/${patient_id}/${physician_id}/`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setMessages(response.data);

        // console.log("Chat Message data", response.data)
        
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, authTokens, patientID, physicianID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !user || !authTokens) return;

    const patient_id = user.role === 'patient' ? user.user_id : patientID;
    const physician_id = user.role === 'physician' ? user.user_id : physicianID;

    if (!patient_id || !physician_id) {
      setError('Missing participant information.');
      return;
    }

    setSending(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/chat/chat_messages/create/',
        {
          patient: patient_id,
          physician: physician_id,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessages([...messages, response.data]);
      setContent('');
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-900 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Chat with {user.role === 'patient' ? 'Doc' : 'Patient'}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 bg-green-300 rounded-full animate-pulse"></span>
            <span className="text-sm">Live Chat</span>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="w-10 h-10 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.user?.role === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.user?.role === 'patient' 
                    ? 'bg-green-100 rounded-tr-none' 
                    : 'bg-blue-100 rounded-tl-none'}`}
                >
                  <p className="text-gray-800">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400 mr-1">
                      @{message.user?.username} 
                    </span>
                    <span className="text-xs text-gray-300">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No messages yet. Start the conversation!</p>
            </div>
          )
        )}
      </div>

      {/* Message Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-grow relative">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="message here..."
              rows="1"
              required
            />
            <button 
              type="button" 
              className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700"
              onClick={() => setContent('')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium ${sending || !content.trim() 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'}`}
          >
            {sending ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ...ing
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send..
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

Chat.propTypes = {
  chatInfo: PropTypes.shape({
    supervisor: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      }),
    }),
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  patientData: PropTypes.shape({
    patient: PropTypes.shape({
      user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      supervisor: PropTypes.shape({
        user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
  }),
};

// prop types
Chat.propTypes = {
  chatInfo: PropTypes.shape({
    supervisor: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  patientData: PropTypes.shape({
    patient: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        email: PropTypes.string,
      }),
      physician: PropTypes.shape({
        user: PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      age_category: PropTypes.string,
      user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    patient_illness: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    user: PropTypes.shape({
      email: PropTypes.string,
      username: PropTypes.string,
    }),
  }),
};

Chat.defaultProps = {
  chatInfo: null,
  patientData: null,
};


export default Chat;