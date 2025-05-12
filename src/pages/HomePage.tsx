// src/pages/HomePage.tsx
"use client";

import { useEffect, useState, useRef, CSSProperties } from "react"; // Import CSSProperties
import Lenis from "lenis";
import Hero01 from "@/components/hero-01/hero-01";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    const handleScroll = (instance: Lenis) => {
      setScrollY(instance.animatedScroll);
    };

    lenisRef.current.on("scroll", handleScroll);

    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.off("scroll", handleScroll);
        lenisRef.current.destroy();
      }
    };
  }, []);

  const pinAndScaleDuration = 400;

  const heroDarkenProgress = Math.min(
    1,
    Math.max(0, scrollY / pinAndScaleDuration)
  );

  const scrollAfterPin = Math.max(0, scrollY - pinAndScaleDuration);
  const revealAnimationDuration = 1000;
  const contentRevealProgress = Math.min(
    1,
    scrollAfterPin / revealAnimationDuration
  );
  const currentRevealRadiusVw = contentRevealProgress * 100;
  const sectionScrollRange = 800;
  const totalSections = 3;

  // Explicitly type the return value as CSSProperties
  const getSectionVisibility = (sectionIndex: number): CSSProperties => {
    const sectionsStartScrollY = pinAndScaleDuration + revealAnimationDuration;
    const normalizedScrollY = Math.max(0, scrollY - sectionsStartScrollY);
    const currentSectionIndex = Math.floor(
      normalizedScrollY / sectionScrollRange
    );
    const transitionProgress =
      (normalizedScrollY % sectionScrollRange) / sectionScrollRange;

    let style: CSSProperties = {
      // Initialize with a base type
      opacity: 0,
      transform: "translateY(50px)",
      zIndex: totalSections - sectionIndex,
      pointerEvents: "none", // This is a valid PointerEvents value
    };

    if (sectionIndex === currentSectionIndex) {
      const fadeStartPoint = 0.3;
      const adjustedProgress =
        transitionProgress < fadeStartPoint
          ? 0
          : (transitionProgress - fadeStartPoint) / (1 - fadeStartPoint);

      style = {
        opacity: 1 - adjustedProgress,
        transform: `translateY(${adjustedProgress * -50}px)`,
        zIndex: totalSections - sectionIndex,
        pointerEvents: adjustedProgress > 0.5 ? "none" : "auto",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      };
    } else if (sectionIndex === currentSectionIndex + 1) {
      const appearStartPoint = 0.3;
      const adjustedProgress =
        transitionProgress < appearStartPoint
          ? 0
          : (transitionProgress - appearStartPoint) / (1 - appearStartPoint);

      style = {
        opacity: adjustedProgress,
        transform: `translateY(${(1 - adjustedProgress) * 50}px)`,
        zIndex: totalSections - sectionIndex,
        pointerEvents: adjustedProgress > 0.5 ? "auto" : "none",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      };
    } else if (sectionIndex < currentSectionIndex) {
      // Secciones pasadas
      style = {
        opacity: 0,
        transform: "translateY(-50px)",
        zIndex: totalSections - sectionIndex,
        pointerEvents: "none",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      };
    }
    // For sectionIndex > currentSectionIndex + 1, the initial 'style' is already correct

    return style;
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="relative"
        style={{
          height: `calc(100vh + ${pinAndScaleDuration}px)`,
        }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Hero01 scrollY={scrollY} />
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at center, 
                transparent 25%, 
                rgba(0, 0, 0, ${heroDarkenProgress * 0.6}) 55%, 
                rgba(0, 0, 0, ${heroDarkenProgress * 0.85}) 75%)`,
            }}
          />
        </div>
      </div>

      <div
        className="relative "
        style={{
          height: `${
            revealAnimationDuration + sectionScrollRange * totalSections
          }px`,
          // Originalmente aquí estaba clipPath, lo vamos a reemplazar
          clipPath: `circle(${currentRevealRadiusVw}vw at center)`,
        }}
      >
        <div className="fixed top-0 left-0 w-full h-screen ">
          <section
            id="servicios-sublimacion"
            className="absolute inset-0 py-24 px-4  bg-white flex items-center transition-all duration-500"
            style={getSectionVisibility(0)}
          >
            <div className="container mx-auto max-w-6x mt-28">
              <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center text-gray-800">
                Creatividad Sin Límites en Sublimación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  {
                    title: "Tazas Mágicas",
                    description:
                      "Desde diseños corporativos hasta regalos personales llenos de color.",
                    icon: "☕️",
                  },
                  {
                    title: "Textiles Únicos",
                    description:
                      "Playeras, cojines, y más, con impresiones vibrantes que duran.",
                    icon: "👕",
                  },
                  {
                    title: "Regalos y Más",
                    description:
                      "Llaveros, carcasas, placas. Personaliza casi cualquier objeto.",
                    icon: "🎁",
                  },
                ].map((service) => (
                  <div
                    key={service.title}
                    className="flex flex-col items-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-6xl mb-5 transform hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-pink-600">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className=" mt-10 text-center">
                <button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => console.log("Navegar a contacto o catálogo")}
                >
                  Descubre Todas las Posibilidades
                </button>
              </div>
            </div>
          </section>

          <section
            className="absolute inset-0 py-24 px-4 bg-gradient-to-b from-white to-pink-50 flex items-center transition-all duration-500"
            style={getSectionVisibility(1)}
          >
            <div className="container mx-auto max-w-6xl mt-24">
              <h2 className="text-4xl mt-10 sm:text-5xl font-bold mb-8 text-center text-gray-800">
                Nuestros Trabajos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl  overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-[30vh] bg-gray-200 relative ">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Imagen {item}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-medium text-lg text-pink-600">
                        Proyecto {item}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Sublimación personalizada
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <button className="bg-white text-pink-600 border-2 border-pink-600 hover:bg-pink-50 font-bold py-3 px-8 rounded-full text-lg shadow-sm transform hover:scale-105 transition-all duration-300 ease-in-out">
                  Ver Galería Completa
                </button>
              </div>
            </div>
          </section>

          <section
            className="absolute inset-0 py-24 px-4 bg-gradient-to-br from-purple-900 to-pink-800 text-white flex items-center transition-all duration-500"
            style={getSectionVisibility(2)}
          >
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                ¿Listo para Personalizar?
              </h2>
              <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
                Contáctanos hoy mismo y haz realidad tus ideas. Presupuestos sin
                compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                  Contactar Ahora
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                  Ver Catálogo
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div style={{ height: "100vh" }}></div>
    </div>
  );
}
