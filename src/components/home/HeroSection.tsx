"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import heroImage from "../../../public/images/heroImage.png";
import claudeLeft from "../../../public/images/left-cloud-transparent.png";
import claudeRight from "../../../public/images/right-cloud-transparent.png";
import styles from "./styles.module.css";
import birdSprite from "../../../public/images/bird-flight-sprite-web.png";
import { HeroTripPlanner } from "./HeroTripPlanner";

// const container = {
//   hidden: {},
//   show: {
//     transition: { staggerChildren: 0.09, delayChildren: 0.05 },
//   },
// };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-65px)] w-full flex-col overflow-hidden text-white lg:flex-row">
      <div className="relative h-[40svh] min-h-[280px] w-full overflow-hidden lg:h-auto lg:w-[55%] lg:overflow-visible ">
        <Image
          src={heroImage}
          alt="Gergeti Trinity Church and Mount Kazbek in Kazbegi, Georgia"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />

        <Image
          src={claudeLeft}
          alt=""
          width={500}
          height={160}
          aria-hidden="true"
          className={`${styles.cloud} ${styles.cloudLeft} z-50`}
        />

        <Image
          src={claudeRight}
          alt=""
          width={450}
          height={150}
          aria-hidden="true"
          className={`${styles.cloud} ${styles.cloudRight}`}
        />

        <div
          className={`${styles.birdFlight} ${styles.birdOne}`}
          aria-hidden="true"
        >
          <Image
            src={birdSprite}
            alt=""
            width={2010}
            height={440}
            className={styles.birdFrames}
          />
        </div>

        <div
          className={`${styles.birdFlight} ${styles.birdTwo}`}
          aria-hidden="true"
        >
          <Image
            src={birdSprite}
            alt=""
            width={2010}
            height={440}
            className={styles.birdFrames}
          />
        </div>

        <div
          className={`${styles.birdFlight} ${styles.birdThree}`}
          aria-hidden="true"
        >
          <Image
            src={birdSprite}
            alt=""
            width={2010}
            height={440}
            className={styles.birdFrames}
          />
        </div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto w-full max-w-2xl px-6 pt-10 text-center font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl lg:mx-0 lg:px-10 lg:pt-16 lg:text-left lg:text-4xl xl:text-[44px]"
        >
          Plan your perfect Georgia trip with AI for Free
        </motion.h1>
      </div>

      {/* Top-aligned so a taller or shorter step only moves the card's bottom edge. */}
      <div className="relative z-20 flex w-full flex-col items-center justify-center px-4 lg:px-0  sm:px-6 lg:w-[45%]  lg:min-h-[calc(100dvh-65px)] py-0 lg:py-0">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5 w-full max-w-[560px] text-center leading-7 text-foreground sm:text-lg lg:text-left"
        >
          Share your preferences and we&apos;ll create an itinerary for you.
        </motion.h2>

        <HeroTripPlanner />
      </div>
    </section>
  );
}
