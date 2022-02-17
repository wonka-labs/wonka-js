import type { NextPage } from 'next';
import Container from '../components/Container';
import ColumnLayout from '../components/ColumnLayout';
import { useEffect } from 'react';

const Home: NextPage = () => {
  // Fix the #hashtag navigation bug in Next.js
  // https://github.com/vercel/next.js/issues/11109
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document?.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    }
  });

  return (
    <Container showsNavigation={true}>
      <ColumnLayout>
        <div>
          <h1> Hello World </h1>
        </div>
        <div>
          <h1> Hello World </h1>
        </div>
      </ColumnLayout>
    </Container>
  );
};

export default Home;
