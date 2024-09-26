import React, {Component, ReactNode} from 'react';
import {motion} from 'framer-motion';

interface ContainerProps {
  children: ReactNode;
}

export class Container extends Component<ContainerProps> {
  render() {
    let {children} = this.props;
    return (
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
        className="h-max bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-[length:200%_200%]"
      >
        <div className="container mx-auto text-center">
          {children}
        </div>
      </motion.div>
    );
  }
}
