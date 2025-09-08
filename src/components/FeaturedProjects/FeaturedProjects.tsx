"use client";
import "./FeaturedProjects.css";
import featuredProjectsContent from "./featured-projects-content";

import { useEffect } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFeaturedProperties } from "@/hooks";

const FeaturedProjects = () => {
  const { properties, loading, error } = useFeaturedProperties(4);

  // Si está cargando, mostrar contenido estático como fallback
  const displayProjects = loading || error || properties.length === 0 
    ? featuredProjectsContent 
    : properties.map(property => ({
        title: property.name || 'Propiedad sin nombre',
        description: property.address || 'Sin dirección disponible',
        info: `$${property.price?.toLocaleString() || '0'} - ${property.year || 'N/A'}`,
        image: property.images && property.images.length > 0 
          ? property.images[0].file 
          : '/featured-projects/featured-work-1.jpg' // Imagen por defecto
      }));

  useEffect(() => {
    // Solo ejecutar animaciones cuando los datos estén cargados y no haya error
    if (loading || error || displayProjects.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Limpiar animaciones anteriores
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const featuredProjectCards = gsap.utils.toArray(".featured-project-card");

    featuredProjectCards.forEach((featuredProjectCard, index) => {
      if (index < featuredProjectCards.length - 1) {
        const featuredProjectCardInner = (featuredProjectCard as HTMLElement).querySelector(
          ".featured-project-card-inner"
        );

        if (!featuredProjectCardInner) return;

        const isMobile = window.innerWidth <= 1000;

        gsap.fromTo(
          featuredProjectCardInner,
          {
            y: "0%",
            z: 0,
            rotationX: 0,
          },
          {
            y: "-50%",
            z: -250,
            rotationX: 45,
            scrollTrigger: {
              trigger: featuredProjectCards[index + 1] as HTMLElement,
              start: isMobile ? "top 85%" : "top 100%",
              end: "top -75%",
              scrub: true,
              pin: featuredProjectCard as HTMLElement,
              pinSpacing: false,
            },
          }
        );

        gsap.to(featuredProjectCardInner, {
          "--after-opacity": 1,
          scrollTrigger: {
            trigger: featuredProjectCards[index + 1] as HTMLElement,
            start: "top 75%",
            end: "top 0%",
            scrub: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, error, displayProjects.length]);

  return (
    <>
      <div className="featured-projects">
        {displayProjects.map((project, index) => (
          <div key={index} className="featured-project-card">
            <div className="featured-project-card-inner">
              <div className="featured-project-card-content">
                <div className="featured-project-card-info">
                  <p>{project.info}</p>
                </div>
                <div className="featured-project-card-content-main">
                  <div className="featured-project-card-title">
                    <h2>{project.title}</h2>
                  </div>
                  <div className="featured-project-card-description">
                    <p className="lg">{project.description}</p>
                  </div>
                </div>
              </div>
              <div className="featured-project-card-img">
                <img src={project.image} alt={project.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedProjects;
