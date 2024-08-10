import React from 'react';
import {motion} from 'framer-motion';

const Hero: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className="h-screen flex items-center justify-center"
        >
            <div className="text-center text-white">
                <motion.h1
                    className="text-5xl font-bold"
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.5}}
                >
                    Jerome Wolff
                </motion.h1>
                <motion.p
                    className="text-xl mt-4"
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 1}}
                >
                    Full Stack Developer
                </motion.p>
            </div>
        </motion.div>
    );
}

export default Hero;
