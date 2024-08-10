import React from 'react';
import {motion} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
    return (
        <motion.footer
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className="text-white py-6 mt-12"
        >
            <div className="container mx-auto text-center">
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.3}}
                    className="mb-4"
                >
                    <h2 className="text-2xl font-semibold">Get in Touch</h2>
                    <p className="text-white">I'd love to hear from you! Feel free to reach out through any of the
                        platforms below.</p>
                </motion.div>
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.6}}
                    className="flex justify-center space-x-6 mb-6"
                >
                    <a href="mailto:jerome.wolff@innovaflux.com" className="text-white hover:text-gray-400">
                        <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <FontAwesomeIcon icon={faEnvelope} size="lg"/>
                        </svg>
                    </a>
                    <a href="https://github.com/JeromeWolff" target="_blank" rel="noopener noreferrer"
                       className="text-white hover:text-gray-400">
                        <FontAwesomeIcon icon={faGithub} size="lg"/>
                    </a>
                    <a href="https://www.linkedin.com/in/jerome-wolff" target="_blank" rel="noopener noreferrer"
                       className="text-white hover:text-gray-400">
                        <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <FontAwesomeIcon icon={faLinkedin} size="lg"/>
                        </svg>
                    </a>
                </motion.div>
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.9}}
                >
                    <p className="text-sm text-white">&copy; {new Date().getFullYear()} Jerome Wolff. All rights
                        reserved.</p>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
