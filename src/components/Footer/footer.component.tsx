import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {socialConfig} from "./footer.config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

interface FooterContainerProps {
    children: ReactNode;
}
interface SocialLinkProps {
    href: string;
    icon: IconDefinition;
}

export class Footer extends Component {
    render() {
        return (
            <FooterContainer>
                <FooterInformationContainer/>
                <SocialContainer/>
                <CopyrightNotice/>
            </FooterContainer>
        );
    }
}

class FooterContainer extends Component<FooterContainerProps> {
    render() {
        let {children} = this.props;
        return (
            <motion.footer
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className="py-6 mt-12"
            >
                <div className="container mx-auto text-center">
                    {children}
                </div>
            </motion.footer>
        );
    }
}

class FooterInformationContainer extends Component {
    render() {
        return (
            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.3}}
                className="mb-4"
            >
                <FooterTitle/>
                <FooterSubtext/>
            </motion.div>
        );
    }
}

class FooterTitle extends Component {
    render() {
        return <h2 className="text-2xl font-semibold">Get in Touch</h2>;
    }
}

class FooterSubtext extends Component {
    render() {
        return <p className="text-white">I'd love to hear from you! Feel free to reach out through any of the platforms
            below.</p>;
    }
}

class SocialContainer extends Component {
    render() {
        return (
            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.6}}
                className="flex justify-center space-x-6 mb-6"
            >
                {socialConfig.socialLinks.map((socialLink) => (
                    <SocialLink href={socialLink.href} icon={socialLink.icon}/>
                ))}
            </motion.div>
        );
    }
}

class SocialLink extends Component<SocialLinkProps> {
    render() {
        let {href, icon} = this.props;
        return (
            <a href={href} target="_blank" rel="noopener noreferrer"
               className="text-white hover:text-gray-400">
                <FontAwesomeIcon icon={icon} size="lg"/>
            </a>
        );
    }
}

class CopyrightNotice extends Component {
    render() {
        return (
            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.9}}
            >
                <p className="text-sm text-white">&copy; {new Date().getFullYear()} Jerome Wolff. All rights
                    reserved.</p>
            </motion.div>
        );
    }
}
