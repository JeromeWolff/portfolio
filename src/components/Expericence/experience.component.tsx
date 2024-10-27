import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {experienceConfig} from "./experience.config";

interface ExperienceContainerProps {
  children: ReactNode;
}

interface ExperienceSubjectProps {
  index: number;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export class Experience extends Component {
  render() {
    return (
      <ExperienceContainer>
        <ExperienceTitle/>
        <ExperienceList/>
      </ExperienceContainer>
    );
  }
}

class ExperienceContainer extends Component<ExperienceContainerProps> {
  render() {
    let {children} = this.props;
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 1}}
        className="items-center justify-center"
      >
        {children}
      </motion.div>
    );
  }
}

class ExperienceTitle extends Component {
  render() {
    return (
      <motion.h2
        className="text-4xl text-white font-bold mb-6"
        initial={{y: 20, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        viewport={{once: true}}
        transition={{delay: 0.3}}
      >
        Experience
      </motion.h2>
    );
  }
}

class ExperienceList extends Component {
  render() {
    return (
      <div className="space-y-8">
        {experienceConfig.experiences.map((experience, index) => (
          <ExperienceSubject
            index={index}
            role={experience.role}
            company={experience.company}
            duration={experience.duration}
            description={experience.description}
          />
        ))}
      </div>
    );
  }
}

class ExperienceSubject extends Component<ExperienceSubjectProps> {
  render() {
    let {index, role, company, duration, description} = this.props;
    return (
      <motion.div
        key={index}
        initial={{y: 20, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        viewport={{once: false}}
        transition={{delay: 0.3 + index * 0.2}}
        className="p-6 bg-gray-800 rounded-lg shadow-lg text-left max-w-3xl mx-auto"
      >
        <h3 className="text-2xl font-semibold">{role}</h3>
        <p className="text-gray-400">{company} | {duration}</p>
        <p className="mt-4">{description}</p>
      </motion.div>
    );
  }
}
