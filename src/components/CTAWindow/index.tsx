
import Image from "next/image";

interface CTAWindowProps {
  img: string;
  header: string;
  callout: string;
  description: string;
}

const CTAWindow = ({ img, header, callout, description }: CTAWindowProps) => {
  return (
    <section className="cta-window relative w-screen h-[100svh] overflow-hidden p-4">
      <div className="container relative w-full h-full bg-[var(--base-450)] rounded-[2rem] overflow-hidden flex items-end">
        {/* Imagen de fondo */}
        <div className="cta-window-img-wrapper absolute inset-0">
          <Image src={img} alt={header} fill className="object-cover" />
        </div>

        {/* Overlay oscuro */}
        <div className="cta-window-img-overlay absolute inset-0 bg-[rgba(20,19,19,0.65)]" />

        {/* Header centrado */}
        <div className="cta-window-header absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-[var(--base-100)] p-4 z-[1]">
          <h1 className="!text-[10vw]">{header}</h1>
        </div>

        {/* Footer */}
        <div className="cta-window-footer relative w-full flex flex-col justify-start items-start gap-2 p-4 text-[var(--base-100)] z-[1] lg:flex-row lg:justify-between lg:items-end lg:p-0">
          <div className="cta-window-callout w-full lg:w-1/4">
            <h3>{callout}</h3>
          </div>

          <div className="cta-window-description w-full text-left lg:w-1/4 lg:text-right">
            <p className="text-[var(--base-300)]">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAWindow;
