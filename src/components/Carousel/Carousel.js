import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';
import styles from './Carousel.module.scss';

const responsiveSettings = [
  {
    breakpoint: 1800,
    settings: {
      slidesToShow: 6,
      slidesToScroll: 3,
    },
  },
  {
    breakpoint: 1200,
    settings: {
      slidesToShow: 5,
      slidesToScroll: 2,
    },
  },
  {
    breakpoint: 800,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 2,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
];
function Carousel({ children, title }) {
  return (
    <div className={styles.carousel}>
      <h5 className={styles.title}>{title}</h5>

      <Slide
        slidesToScroll={2}
        slidesToShow={4}
        indicators
        duration={500}
        transitionDuration={500}
        autoplay={false}
        responsive={responsiveSettings}
      >
        {children}
      </Slide>
    </div>
  );
}

export default Carousel;
