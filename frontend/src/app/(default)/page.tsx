import Carousel from "@/components/default/Carousel";
import Slideshow from "@/components/default/Slideshow";
import {fullWidthClassName} from "react-remove-scroll-bar";

export default function Home() {

  return (
      <main className={"w-full flex flex-col justify-center items-center"}>
          <Slideshow></Slideshow>
          <section className={"w-[90dvw]"}>
            <h2>Playing Now</h2>
            <Carousel carouselType={"playing-now"}/>
          </section>
          <section className={"w-[90dvw]"}>
              <h2>Coming Soon</h2>
              <Carousel carouselType={"coming-soon"}/>
          </section>
      </main>
  );
}