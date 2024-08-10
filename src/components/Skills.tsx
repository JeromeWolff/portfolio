import React from 'react';
import {motion} from 'framer-motion';

let skills = [
    {name: 'Java', level: 'Advanced'},
    {name: 'Spring Boot', level: 'Intermediate'},
    {name: 'JavaScript', level: 'Intermediate'},
    {name: 'TypeScript', level: 'Intermediate'},
    {name: 'Node.js', level: 'Intermediate'},
    {name: 'React', level: 'Intermediate'},
    {name: 'CSS/SASS', level: 'Advanced'},
    {name: 'Tailwind CSS', level: 'Advanced'},
];

const Skills: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className="h-screen items-center justify-center"
        >
            <div className="container mx-auto text-center">
                <motion.h2
                    className="text-4xl font-bold mb-6"
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    viewport={{once: true}}
                    transition={{delay: 0.3}}
                >
                    Skills
                </motion.h2>
                <div className="flex flex-wrap justify-center">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            className="m-4 p-4 bg-gray-100 rounded-lg shadow-lg w-48"
                            initial={{scale: 0.9, opacity: 0}}
                            whileInView={{scale: 1, opacity: 1}}
                            viewport={{once: true}}
                            transition={{delay: 0.3 + index * 0.1}}
                        >
                            <h3 className="text-xl font-semibold">{skill.name}</h3>
                            <p className="text-gray-600">{skill.level}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Skills;
