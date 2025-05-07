import React, {Component} from 'react';
import {
  Container,
  Hero,
  About,
  Experience,
  Footer
} from "../components";

export class Home extends Component {
  render() {
    return (
      <Container>
        <main>
          <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>;
          <Hero/>
          <About/>
          <Experience/>
        </main>
        <Footer/>
      </Container>
    );
  }
}
