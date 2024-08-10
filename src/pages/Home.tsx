import React from 'react';
import Container from "../components/Container";
import Hero from '../components/Hero';
import About from "../components/About";
import Experience from "../components/Experience";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <Container>
            <Hero/>
            <About/>
            <Experience/>
            <Footer />
        </Container>
    );
}

export default Home;
