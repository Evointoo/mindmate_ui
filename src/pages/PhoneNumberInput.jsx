import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * PhoneNumberInput - Collect phone number after Google OAuth
 * Validates Indian phone numbers and checks for existing users
 */
function PhoneNumberInput({ email, onSubmit, onLinkGoogle }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');

    const validatePhoneNumber = (phone) => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');

        // Check if it's a valid Indian phone number (10 digits)
        if (cleaned.length === 10 && cleaned[0] >= '6' && cleaned[0] <= '9') {
            return true;
        }

        // Check if it includes country code (+91)
        if (cleaned.length === 12 && cleaned.startsWith('91')) {
            return true;
        }

        return false;
    };

    const formatPhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, '');

        // If starts with 91, remove it
        if (cleaned.startsWith('91') && cleaned.length === 12) {
            return cleaned.substring(2);
        }

        return cleaned;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        setError('');
    };

    const handleSubmit = async () => {
        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid 10-digit Indian phone number');
            return;
        }

        setIsValidating(true);
        setError('');

        try {
            const formattedPhone = formatPhoneNumber(phoneNumber);

            // Check if user exists with this phone (you'll implement this API)
            // const response = await fetch(`/api/auth/check-phone?phone=${formattedPhone}`);
            // const data = await response.json();

            // For now, just proceed with signup
            onSubmit(formattedPhone);
        } catch (err) {
            setError('Failed to validate phone number. Please try again.');
            setIsValidating(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && validatePhoneNumber(phoneNumber)) {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Complete Your Profile
                    </h2>
                    <p className="text-gray-400">
                        We need your phone number for account security and recovery
                    </p>
                </div>

                {/* Email display */}
                <div className="mb-6 p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Google Account</p>
                    <p className="text-sm text-white font-medium">{email}</p>
                </div>

                {/* Phone number input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        onKeyPress={handleKeyPress}
                        placeholder="98765 43210"
                        className={`
              w-full px-4 py-3 bg-gray-700 border rounded-lg text-white 
              focus:outline-none focus:border-purple-500 transition-colors
              ${error ? 'border-red-500' : 'border-gray-600'}
            `}
                        maxLength={15}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Enter your 10-digit Indian mobile number
                    </p>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle size={16} className="text-red-500" />
                            <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                    )}
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={!phoneNumber || isValidating}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                >
                    {isValidating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Validating...
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                {/* Privacy note */}
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-xs text-gray-400 text-center">
                        Your phone number is used for account recovery and security.
                        We will never share it with third parties or use it for marketing.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

PhoneNumberInput.propTypes = {
    email: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onLinkGoogle: PropTypes.func,
};

export default PhoneNumberInput;
