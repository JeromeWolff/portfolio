import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {skillsConfig} from "./skills.config";

interface SkillsContainerProps {
    children: ReactNode;
}

interface SkillProps {
    index: number;
    name: string;
    level: string;
}

export class Skills extends Component {
    render() {
        return (
            <SkillsContainer>
                <SkillsTitle/>
                <SkillList>
                    {skillsConfig.skills.map((skill, index) => (
                        <Skill index={index} name={skill.name} level={skill.level}/>
                    ))}
                </SkillList>
            </SkillsContainer>
        );
    }
}

class SkillsContainer extends Component<SkillsContainerProps> {
    render() {
        let {children} = this.props;
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className="h-screen items-center justify-center"
            >
                <div className="container mx-auto text-center">
                    {children}
                </div>
            </motion.div>
        );
    }
}

class SkillsTitle extends Component {
    render() {
        return (
            <motion.h2
                className="text-4xl font-bold mb-6"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: true}}
                transition={{delay: 0.3}}
            >
                Skills
            </motion.h2>
        );
    }
}

class SkillList extends Component<SkillsContainerProps> {
    render() {
        let {children} = this.props;
        return (
            <div className="flex flex-wrap justify-center">
                {children}
            </div>
        );
    }
}

class Skill extends Component<SkillProps> {
    render() {
        let {index, name, level} = this.props;
        return (
            <motion.div
                key={name}
                className="m-4 p-4 bg-gray-100 rounded-lg shadow-lg w-48"
                initial={{scale: 0.9, opacity: 0}}
                whileInView={{scale: 1, opacity: 1}}
                viewport={{once: true}}
                transition={{delay: 0.3 + index * 0.1}}
            >
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-gray-600">{level}</p>
            </motion.div>
        );
    }
}
