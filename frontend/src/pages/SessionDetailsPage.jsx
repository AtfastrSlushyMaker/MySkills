import { useParams, useNavigate } from 'react-router-dom';
import SessionDetails from '../components/SessionDetails';
import GlassmorphismBackground from '../components/GlassmorphismBackground';

function SessionDetailsPage({ role = 'trainer' }) {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen overflow-hidden">
            <GlassmorphismBackground />
            <SessionDetails
                sessionId={sessionId}
                onBack={() => navigate(-1)}
            />
        </div>
    );
}

export default SessionDetailsPage;
