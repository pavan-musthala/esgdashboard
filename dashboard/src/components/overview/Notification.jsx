import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                        type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                    <div className="flex items-center gap-2">
                        {type === 'success' ? <CheckCircle /> : <XCircle />}
                        <span>{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;