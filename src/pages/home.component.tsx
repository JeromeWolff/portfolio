import React, {Component} from 'react';
import {Container, Hero, About, Experience, Footer} from "../components";

export class Home extends Component {
    render() {
        return (
            <Container>
                <Hero/>
                <About/>
                <Experience/>
                <Footer/>
            </Container>
        );
    }
}
