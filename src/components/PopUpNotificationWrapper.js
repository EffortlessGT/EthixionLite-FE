import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopupNotificationWrapper = ({ children }) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => setVisible(false);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="regeratedAPIDIV"
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <h2>Regenerated API Key</h2>
                    <strong>New API key Generated.</strong><br />
                    <strong>Your API Key: Ethixdssnsdvk0124840</strong>
                    <p>
                        Your new Ethixion API key has been created. Keep it private
                        and never share it publicly. Use it in only authorized application.
                    </p>

                    <button onClick={handleClose}>I Understand</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupNotificationWrapper;
