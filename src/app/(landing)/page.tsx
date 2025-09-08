"use client";

import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import ReactLenis from "lenis/react";
import Image from "next/image";

import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import FeaturedProjects from "@/components/FeaturedProjects/FeaturedProjects";
import { useStats } from "@/hooks";

let isInitialLoad = true;
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  const tagsRef = useRef<HTMLDivElement>(null);
  const [showPreloader] = useState(isInitialLoad);
  const { totalProperties, totalOwners, loading: statsLoading } = useStats();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    if (showPreloader) {
      tl.to(
        ".word h1",
        {
          y: "0%",
          duration: 1,
        },
        "<"
      );

      tl.to(".divider", {
        scaleY: "100%",
        duration: 1,
        onComplete: () => {
          gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 });
        },
      });

      tl.to("#word-1 h1", {
        y: "100%",
        duration: 1,
        delay: 0.3,
      });

      tl.to(
        "#word-2 h1",
        {
          y: "-100%",
          duration: 1,
        },
        "<"
      );

      tl.to(
        ".block",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          stagger: 0.1,
          delay: 0.75,
          onStart: () => {
            gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" });
          },
          onComplete: () => {
            gsap.set(".loader", { pointerEvents: "none" });
          },
        },
        "<"
      );
    }
  }, [showPreloader]);

  useGSAP(
    () => {
      if (!tagsRef.current) return;

      const tags = tagsRef.current.querySelectorAll(".what-we-do-tag");
      
      // Fallback: asegurar que los tags sean visibles después de 2 segundos
      const fallbackTimeout = setTimeout(() => {
        gsap.set(tags, { opacity: 1, x: 0 });
      }, 2000);

      gsap.set(tags, { opacity: 0, x: -40 });

      ScrollTrigger.create({
        trigger: tagsRef.current,
        start: "top 90%",
        once: true,
        animation: gsap.to(tags, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => {
            clearTimeout(fallbackTimeout);
          }
        }),
      });

      // Cleanup function
      return () => {
        clearTimeout(fallbackTimeout);
      };
    },
    { scope: tagsRef }
  );

  return (
    <>
      <ReactLenis root options={{ duration: 0.8 }} />
      {showPreloader && (
        <div className="loader fixed top-0 left-0 w-screen h-[100svh] overflow-hidden z-[100000] [pointer-events:all]">
          {/* Overlay / Cortinas */}
          <div className="absolute inset-0 flex text-[var(--base-100)]">
            <div className="block w-full h-full bg-[var(--base-500)] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" />
            <div className="block w-full h-full bg-[var(--base-500)] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" />
          </div>

          {/* Logo de palabras */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div
              id="word-1"
              className="word relative left-0 pr-1 text-[var(--base-100)] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"
            >
              {/* inicia arriba (-120%) */}
              <h1 className="relative translate-y-[-120%] will-change-transform !text-[2rem] text-[var(--base-300)] !tracking-[-0.05rem]">
                Million
              </h1>
            </div>

            <div
              id="word-2"
              className="word relative left-2 pr-1 text-[var(--base-100)] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"
            >
              {/* inicia abajo (120%) */}
              <h1 className="relative translate-y-[120%] will-change-transform !text-[2rem] text-[var(--base-300)] !tracking-[-0.05rem]">
                Properties
              </h1>
            </div>
          </div>

          {/* Línea vertical que escala en Y */}
          <div className="divider absolute top-0 left-1/2 -translate-x-1/2 origin-top w-px h-full bg-[rgba(242,237,230,0.125)] scale-y-0 will-change-transform" />
        </div>
      )}
      <section className="hero relative w-screen h-[175svh] lg:h-[135svh] overflow-hidden bg-[#d3cec5]">
        <div className="hero-bg absolute inset-0 pointer-events-none">
          <Image
            src="/home/hero.jpg"
            alt="Million Properties — Propiedades destacadas"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className=" absolute bottom-0 left-0 w-full h-[50svh] z-[2] bg-[linear-gradient(360deg,rgba(20,19,19,1)_0%,rgba(20,19,19,0)_100%)]"></div>
        <div className="container">
          <div className=" absolute left-1/2 top-[50svh] -translate-x-1/2 -translate-y-1/2 text-[var(--base-100)] text-center w-full lg:w-3/4 flex flex-col justify-center items-center gap-8 p-4">
            <h1>Hogares y espacios con sentido, humanos y atemporales</h1>
            <div className=" w-3/4 lg:w-full text-[var(--base-200)]">
              <p className="md:!text-xl">
                En Million Properties conectamos personas e inversionistas con
                propiedades únicas. Diseñamos experiencias de visita claras,
                cálidas y centradas en el detalle para ayudarte a elegir con
                tranquilidad.
              </p>
            </div>
            <AnimatedButton
              label="Ver Propiedades"
              route="/properties"
              animateOnScroll={false}
              delay={showPreloader ? 4.3 : 1.15}
            />
          </div>
        </div>
        <div className=" absolute bottom-0 w-full z-[2]">
          <div className="container flex flex-col lg:flex-row gap-6 w-full pb-8">
            <div className=" flex-1 flex flex-col items-center justify-center p-6 aspect-[16/8] lg:aspect-[16/10] text-[var(--base-200)] bg-gradient-to-br from-[rgba(242,237,230,0.15)] to-[rgba(242,237,230,0.05)] backdrop-blur-[1rem] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:from-[rgba(242,237,230,0.2)] hover:to-[rgba(242,237,230,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:scale-[1.02]">
              <h2 className="!text-[3rem] md:!text-[4rem] font-light tracking-tight mb-4">
                {statsLoading ? '...' : `${totalProperties}+`}
              </h2>
              <p className="md:!text-xl font-light text-[var(--base-300)] text-center">Propiedades publicadas</p>
            </div>


            <div className=" flex-1 flex flex-col items-center justify-center p-6 aspect-[16/8] lg:aspect-[16/10] text-[var(--base-200)] bg-gradient-to-br from-[rgba(242,237,230,0.15)] to-[rgba(242,237,230,0.05)] backdrop-blur-[1rem] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:from-[rgba(242,237,230,0.2)] hover:to-[rgba(242,237,230,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:scale-[1.02]">
              <h2 className="!text-[3rem] md:!text-[4rem] font-light tracking-tight mb-4">
                {statsLoading ? '...' : `${totalOwners}+`}
              </h2>
              <p className="md:!text-xl font-light text-[var(--base-300)] text-center">Aliados interdisciplinarios</p>
            </div>

          </div>
        </div>
      </section>

      <section className=" w-screen h-max text-[var(--base-100)]">
        <div className="container">
          <h1 className="mb-[8rem] lg:mb-[10rem] text-[var(--base-100)]">
            <span className="spacer">&nbsp;</span>
            Diseñamos con propósito y claridad: espacios que hablan a través de
            la luz, la escala y la serenidad de las formas que perduran.
          </h1>

          <div className=" w-full flex flex-col lg:flex-row gap-8">
            <div className=" flex-1 flex flex-col gap-4 ">
              <h3>Cómo trabajamos</h3>
              <p className="lg:text-[var(--base-300)] lg:w-1/2">
                Abordamos cada proyecto con intención. Investigamos, iteramos
                y conversamos para depurar lo esencial. El resultado: lugares
                pensados para vivirse, con materiales honestos y detalles que
                acompañan el día a día.
              </p>
            </div>

            <div className="flex-1">
              <div ref={tagsRef} className="w-full">
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Luz natural</h3>
                </div>
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Vistas</h3>
                </div>
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Texturas</h3>
                </div>
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Diseño sereno</h3>
                </div>
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Ritmo pausado</h3>
                </div>
                <div className="what-we-do-tag inline-block hover:bg-amber-900 transition-all duration-300 px-4 py-3 lg:px-8 lg:py-4 mr-2 mb-2 border border-[var(--base-400)] rounded-[4rem]">
                  <h3>Modularidad</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-screen pt-[10rem] text-[var(--base-100)] overflow-hidden">
        <div className="container text-center">
          <div className=" text-[var(--base-350)] mb-8">
            <p>Proyectos destacados</p>
          </div>
          <div className="w-full lg:w-1/2 mx-auto mb-8">
            <h2>Una selección de hogares y espacios recientes</h2>
          </div>
        </div>

        <FeaturedProjects />
      </section>

      <section className=" relative w-screen min-h-[100svh] h-full flex justify-center items-center overflow-hidden bg-[var(--base-500)] text-[var(--base-200)]">
        <div className=" container w-full h-full flex flex-col lg:flex-row justify-center items-center gap-8">
          <div className="flex-1 flex flex-col gap-4 w-full  md:w-[80%] lg:w-full">
            <div className="relative left-0 lg:left-[-10vw] flex w-full gap-4 items-end">
              <div className="relative aspect-[5/4] flex-[0.75] rounded-xl overflow-hidden">
                <Image
                  src="/gallery-callout/gallery-callout-1.jpg"
                  alt="Interior cálido con luz natural"
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className="  relative aspect-[5/4] flex-1 rounded-xl overflow-hidden">
                <Image
                  src="/gallery-callout/gallery-callout-2.jpg"
                  alt="Fachada contemporánea con vegetación"
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                />
                <div className="hidden lg:block absolute z-[1] bottom-4 left-4 p-4 rounded-xl text-[var(--base-100)] bg-[rgba(20,19,19,0.25)] backdrop-blur-[15px]">
                  <h3>800+</h3>
                  <p className="text-[var(--base-200)]">
                    Imágenes de proyectos
                  </p>
                </div>
              </div>
            </div>
            <div className="relative left-0 lg:left-[-10vw] flex w-full gap-4 items-start">
              <div className=" relative aspect-[5/4] flex-1 rounded-xl overflow-hidden">
                <Image
                  src="/gallery-callout/gallery-callout-3.jpg"
                  alt="Detalles en madera y piedra"
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className=" relative aspect-[5/4] flex-[0.75] rounded-xl overflow-hidden">
                <Image
                  src="/gallery-callout/gallery-callout-4.jpg"
                  alt="Terraza con horizonte abierto"
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className=" flex-1">
            <div className=" flex flex-col gap-8">
              <h3 className="">
                Mira de cerca los proyectos que definen nuestra práctica.
                Desde interiores íntimos hasta paisajes abiertos, cada imagen
                revela una perspectiva que puede inspirar tu próxima decisión.
              </h3>
              <AnimatedButton label="Ver Propiedades" route="/properties" />
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
}
