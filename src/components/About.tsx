import React from 'react';
import {motion} from 'framer-motion';

const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate).getTime();
    const ageDifMs = Date.now() - birthDate;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const birthdate = "2004-07-12";
const age = calculateAge(birthdate);

const About: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className="h-screen flex flex-col items-center justify-center"
        >
            <motion.h2
                className="text-4xl font-bold mb-6"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{delay: 0.3}}
            >
                About Me
            </motion.h2>
            <motion.div
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{delay: 0.6}}
                className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto"
            >
                <motion.p
                    className="text-lg mb-4"
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: false}}
                    transition={{delay: 0.5}}
                >
                    Hi, I'm a {age}-year-old Full Stack Developer with a passion for creating seamless and efficient
                    web applications. My journey in tech has been driven by a love for problem-solving and the
                    thrill of bringing ideas to life through code.
                </motion.p>
                <motion.p
                    className="text-lg mb-4"
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: false}}
                    transition={{delay: 0.5}}
                >
                    When I'm not coding, you'll likely find me exploring the world of fragrances. I'm a true perfume
                    enthusiast who enjoys discovering unique scents that tell a story.
                </motion.p>
                <motion.p
                    className="text-lg mb-4"
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: false}}
                    transition={{delay: 0.5}}
                >
                    Beyond technology and perfumes, I have a keen interest in economics, politics, and military
                    strategy. I find the interplay between these fields fascinating and love diving into discussions
                    about how they shape our world. Whether it’s analyzing market trends, understanding political
                    landscapes, or studying historical military tactics, I'm always eager to learn more.
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default About;
