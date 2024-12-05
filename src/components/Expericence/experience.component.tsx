import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {experienceConfig} from "./experience.config";
import {classNames} from "../../helpers";

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
        <ExperienceTimeline/>
      </ExperienceContainer>
    );
  }
}

class ExperienceContainer extends Component<ExperienceContainerProps> {
  render() {
    let {children} = this.props;
    return (
      <motion.div
        className={classNames("flex", "flex-col", "items-center", "justify-center", "p-8")}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 1}}
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
        className={classNames("text-4xl", "text-white", "font-bold", "mb-6")}
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

class ExperienceTimeline extends Component {
  render() {
    return (
      <div
        className={classNames("relative", "space-y-8", "max-w-4xl", "w-full")}>
        {experienceConfig.experiences.map((experience, index) => (
          <ExperienceSubject
            key={index}
            index={index}
            role={experience.role}
            company={experience.company}
            duration={experience.duration}
            description={experience.description}
          />
        ))}
        <ExperienceTimelineLine/>
      </div>
    );
  }
}

class ExperienceTimelineLine extends Component {
  render() {
    return (
      <div
        className={classNames("absolute", "left-2", "top-0", "h-full", "w-1", "bg-gray-700", "rounded-full")}/>
    );
  }
}

class ExperienceSubject extends Component<ExperienceSubjectProps> {
  render() {
    let {index, role, company, duration, description} = this.props;
    return (
      <motion.div
        key={index}
        className={classNames(
          "relative",
          "pl-10",
          "pr-6",
          "py-4",
          "bg-gray-800",
          "rounded-lg",
          "shadow-lg",
          "max-w-3xl",
          "mx-auto",
          "hover:bg-gray-700",
          "hover:scale-105",
          "transition-transform",
          "duration-300",
          "ease-in-out"
        )}
        initial={{y: 20, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        viewport={{once: true}}
        transition={{delay: 0.3 + index * 0.2}}
      >
        <div
          className={classNames("absolute", "-left-5", "top-4", "w-8", "h-8", "bg-gray-700", "rounded-full")}/>
        <h3
          className={classNames("text-2xl", "font-semibold", "text-white")}>{role}</h3>
        <p
          className={classNames("text-gray-400", "mt-1")}>{company} | {duration}</p>
        <p className={classNames("mt-4", "text-gray-300")}>{description}</p>
      </motion.div>
    );
  }
}
