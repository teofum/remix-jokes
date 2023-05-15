import { Link } from '@remix-run/react';
import Container from '~/components/Container';

export default function IndexRoute() {
  return (
    <div className="bg-purple-radial min-h-screen">
      <Container
        className="
          min-h-screen
          flex
          flex-col
          justify-center
          items-center
        "
      >
        <div className="flex flex-col justify-center items-center py-12">
          <h1
            className="
              font-display
              text-center
              text-4xl
              sm:text-5xl
              lg:text-6xl
              leading-[0.5]
              text-shadow-hero
            "
          >
            Remix
            <span className="block text-7xl sm:text-8xl lg:text-9xl uppercase">
              J🤪kes!
            </span>
          </h1>
          <nav>
            <ul className="flex gap-4 sm:gap-6 font-display text-lg md:text-xl leading-none">
              <li>
                <Link to="jokes" className="hover:decoration-wavy">
                  Read Jokes
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
}
