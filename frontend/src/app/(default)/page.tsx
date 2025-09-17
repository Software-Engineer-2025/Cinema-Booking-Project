import Carousel from "@/components/default/Carousel";

export default function Home() {

  return (
      <>
        <section>
            {
                /*
                   Make a component that has a movie poster, name, and cover. When the user clicks right/left it moves
                   through an array of 4 or less "Featured"

                   Slideshow
                   SlideshowCard
                 */
            }

        </section>
        <section>
            <h2>Playing Now</h2>
            <Carousel carouselType={"playing-now"}/>
        </section>
        <section>
            <h2>Coming Soon</h2>
            <Carousel carouselType={"coming-soon"}/>
        </section>
      </>
  );
}