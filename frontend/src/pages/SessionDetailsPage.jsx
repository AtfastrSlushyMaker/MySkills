import { useParams, useNavigate } from 'react-router-dom';
import SessionDetails from '../components/SessionDetails';

function SessionDetailsPage({ role = 'trainer' }) {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    return (
        <SessionDetails
            sessionId={sessionId}
            onBack={() => navigate(-1)}
        />
    );
}

export default SessionDetailsPage;
