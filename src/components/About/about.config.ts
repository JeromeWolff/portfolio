interface AboutConfig {
  birthdate: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export const aboutConfig: AboutConfig = {
  birthdate: '2004-07-12',
  sections: [
    {
      title: 'Introduction',
      content: `Hi, I'm a {age}-year-old Full Stack Developer with a passion for creating seamless and efficient web applications. My journey in tech has been driven by a love for problem-solving and the thrill of bringing ideas to life through code.`,
    },
    {
      title: 'Hobbies',
      content:
        "When I'm not coding, you'll likely find me exploring the world of fragrances. I'm a true perfume enthusiast who enjoys discovering unique scents that tell a story.",
    },
    {
      title: 'Interests',
      content:
        'Beyond technology and perfumes, I have a keen interest in economics, politics, and military strategy. I find the interplay between these fields fascinating and love diving into discussions about how they shape our world.',
    },
  ],
};
