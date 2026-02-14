import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hash, Calendar, Users, Heart, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { profileAPI } from '../utils/api';

function ProfileSetup({ user }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Profile data
    const [username, setUsername] = useState('');
    const [usernameStatus, setUsernameStatus] = useState(''); // 'available', 'error', ''
    const [usernameMessage, setUsernameMessage] = useState('');
    const [actualName, setActualName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    // Avatar data
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [friendName, setFriendName] = useState('');

    useEffect(() => {
        // Load avatars for step 2
        const loadAvatars = async () => {
            try {
                const response = await profileAPI.getAvatars();
                setAvatars(response.data.avatar_options);
            } catch (err) {
                console.error('Failed to load avatars:', err);
            }
        };
        loadAvatars();
    }, []);

    const checkUsername = async (value) => {
        if (value.length < 3) {
            setUsernameStatus('error');
            setUsernameMessage('Username must be at least 3 characters');
            return;
        }

        try {
            const response = await profileAPI.checkUsername(value);
            setUsernameStatus(response.data.status);
            setUsernameMessage(response.data.message);
        } catch (err) {
            setUsernameStatus('error');
            setUsernameMessage('Error checking username');
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
        setUsername(value);

        if (value.length >= 3) {
            // Debounce check
            clearTimeout(window.usernameTimeout);
            window.usernameTimeout = setTimeout(() => checkUsername(value), 500);
        } else {
            setUsernameStatus('');
            setUsernameMessage('');
        }
    };

    const handleStep1Next = () => {
        if (!username || usernameStatus !== 'available') {
            setError('Please choose an available username');
            return;
        }
        if (!actualName || actualName.trim().length < 2) {
            setError('Please enter your name');
            return;
        }
        if (!age || age < 1 || age > 150) {
            setError('Please enter a valid age');
            return;
        }
        if (!gender) {
            setError('Please select your gender');
            return;
        }

        setError(null);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!selectedAvatar) {
            setError('Please select an avatar');
            return;
        }
        if (!friendName || friendName.trim().length < 2) {
            setError('Please name your friend');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Save profile
            await profileAPI.setupProfile({
                user_id: user.id,
                username,
                actual_name: actualName,
                age: parseInt(age),
                gender
            });

            // Step 2: Save avatar selection
            await profileAPI.selectAvatar({
                user_id: user.id,
                avatar_id: selectedAvatar,
                friend_name: friendName
            });

            // Redirect to personality analysis
            navigate('/personality-analysis');
        } catch (err) {
            console.error('Profile setup error:', err);
            setError(err.response?.data?.detail || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black-primary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-neon/5 rounded-full blur-3xl" />

            <motion.div
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-green-neon text-black' : 'bg-white/10 text-white/40'
                                }`}>
                                {step > 1 ? <Check size={16} /> : '1'}
                            </div>
                            <div className={`h-1 w-20 ${step >= 2 ? 'bg-green-neon' : 'bg-white/10'}`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-green-neon text-black' : 'bg-white/10 text-white/40'
                                }`}>
                                2
                            </div>
                        </div>
                        <span className="text-sm text-white/60">Step {step} of 2</span>
                    </div>
                </div>

                <div className="glass-panel p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
                                    <p className="text-white/60">Tell us a bit about yourself</p>
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        <Hash className="inline w-4 h-4 mr-1" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        placeholder="your_username"
                                        className="input-glass"
                                    />
                                    {usernameMessage && (
                                        <p className={`mt-2 text-sm ${usernameStatus === 'available' ? 'text-green-neon' : 'text-red-400'
                                            }`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                </div>

                                {/* Actual Name */}
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        <User className="inline w-4 h-4 mr-1" />
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={actualName}
                                        onChange={(e) => setActualName(e.target.value)}
                                        placeholder="What should we call you?"
                                        className="input-glass"
                                    />
                                    <p className="mt-1 text-xs text-white/40">Your AI will use this name in conversations</p>
                                </div>

                                {/* Age & Gender */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            <Calendar className="inline w-4 h-4 mr-1" />
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="25"
                                            min="1"
                                            max="150"
                                            className="input-glass"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            <Users className="inline w-4 h-4 mr-1" />
                                            Gender
                                        </label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="input-glass"
                                        >
                                            <option value="">Select...</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStep1Next}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    Next: Choose Your Friend
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Choose Your Friend</h2>
                                    <p className="text-white/60">Select an avatar and give them a name</p>
                                </div>

                                {/* Avatar selection grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {avatars.map((avatar) => (
                                        <motion.div
                                            key={avatar.id}
                                            onClick={() => setSelectedAvatar(avatar.id)}
                                            className={`glass-panel p-4 cursor-pointer transition-all ${selectedAvatar === avatar.id
                                                ? 'ring-2 ring-green-neon'
                                                : 'hover:bg-white/5'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="aspect-square bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={avatar.image_url}
                                                    alt={avatar.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm text-white/80 text-center">{avatar.name}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Friend name input */}
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        <Heart className="inline w-4 h-4 mr-1" />
                                        Name Your Friend
                                    </label>
                                    <input
                                        type="text"
                                        value={friendName}
                                        onChange={(e) => setFriendName(e.target.value)}
                                        placeholder="e.g., Alex, Sam, Luna"
                                        className="input-glass"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="btn-ghost flex items-center gap-2"
                                        disabled={loading}
                                    >
                                        <ChevronLeft size={18} />
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Continue'}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default ProfileSetup;
