import React from 'react';
import {motion} from 'framer-motion';

let experiences = [
    {
        company: 'GommeHDnet GmbH',
        role: "Java Developer",
        duration: "10/2020 - 09/2021 & 09/2022 - 03/2024",
        description: "Development of mini-games and frameworks for a multiplayer network with over 4.4 million registered users, using modern technologies such as Cassandra/Datastax Enterprise, MySQL, Redis, Zookeeper, the client-server framework Netty, Maven as the build tool, and Git as the version control system.",
    },
    {
        company: "regiocom Customer Care SE",
        role: "Customer Service Representative",
        duration: "06/2023 - 11/2023",
        description: "Handling customer inquiries via phone, email, contact form, or (WhatsApp or web) chat, providing information on billing questions, products, prices, tariffs, or contract data, order processing for an electricity or gas supply contract, recording cancellations, revocations, powers of attorney, and death notifications, and documenting concerns in the database."
    },
    {
        company: "Rügentest",
        role: "Executive Assistant",
        duration: "09/2021 - 10/2022",
        description: "Conducting and monitoring SARS-CoV-2 PoC antigen tests, swab sampling and documentation of SARS-CoV-2 PCR tests, maintaining customer data, setting up hardware and software, customer support via phone and email, personnel management, and assisting the management."
    },
    {
        company: "KFR Kreide-Farbenwerk Rügen GmbH",
        role: "IT Specialist",
        duration: "06/2021 - 09/2021",
        description: "Maintenance and upkeep of the web presence for affiliated companies, mobile app development with a focus on React Native and TypeScript in the frontend, as well as Java, Spring, and MariaDB in the backend, programming a Siemens PLC (Programmable Logic Controller) for use in an aquaponic system using ladder logic, function block diagram, instruction list, and structured text."
    },
];

const Experience: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className="items-center justify-center"
        >
            <motion.h2
                className="text-4xl font-bold mb-6"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: true}}
                transition={{delay: 0.3}}
            >
                Experience
            </motion.h2>
            <div className="space-y-8">
                {experiences.map((experience, index) => (
                    <motion.div
                        key={index}
                        initial={{y: 20, opacity: 0}}
                        whileInView={{y: 0, opacity: 1}}
                        viewport={{once: false}}
                        transition={{delay: 0.3 + index * 0.2}}
                        className="p-6 bg-white rounded-lg shadow-lg text-left max-w-3xl mx-auto"
                    >
                        <h3 className="text-2xl font-semibold">{experience.role}</h3>
                        <p className="text-gray-600">{experience.company} | {experience.duration}</p>
                        <p className="mt-4 text-gray-800">{experience.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Experience;
