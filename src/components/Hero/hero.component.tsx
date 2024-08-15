import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {heroConfig} from "./hero.config";

interface HeroContainerProps {
    children: ReactNode;
}

export class Hero extends Component {
    render() {
        return (
            <HeroContainer>
                <HeroTitle/>
                <HeroSubtext/>
            </HeroContainer>
        );
    }
}

class HeroContainer extends Component<HeroContainerProps> {
    render() {
        let {children} = this.props;
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className="h-screen flex items-center justify-center"
            >
                <div className="text-center text-white">
                    {children}
                </div>
            </motion.div>
        );
    }
}

class HeroTitle extends Component {
    render() {
        return (
            <motion.h1
                className="text-5xl font-bold"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.5}}
            >
                {heroConfig.title}
            </motion.h1>
        );
    }
}

class HeroSubtext extends Component {
    render() {
        return (
            <motion.p
                className="text-xl mt-4"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 1}}
            >
                {heroConfig.subtext}
            </motion.p>
        );
    }
}
