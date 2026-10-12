import { useEffect, useRef, useState } from "react";

const surfaces = [
  {
    name: "Ivory Vein",
    finish: "High gloss",
    image:
      "https://images.unsplash.com/photo-1551554781-c46200ea959d?auto=format&fit=crop&w=1200&q=88",
  },
  {
    name: "Nero Current",
    finish: "Polished",
    image:
      "https://images.unsplash.com/photo-1550053808-52a75a05955d?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Dune Strata",
    finish: "Textured",
    image:
      "https://images.unsplash.com/photo-1635315619556-5826839a1bea?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Silver Trace",
    finish: "Satin",
    image:
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Terra Flow",
    finish: "Suede",
    image:
      "https://images.unsplash.com/photo-1600095355173-b970ea5ceb46?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "White Carrara",
    finish: "Soft matte",
    image:
      "https://images.unsplash.com/photo-1694378061128-d3df24b1ae47?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Obsidian",
    finish: "High gloss",
    image:
      "https://images.unsplash.com/photo-1631626019917-f8c07da22f97?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Travertine",
    finish: "Natural",
    image:
      "https://images.unsplash.com/photo-1603369425250-b276f2006ec0?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Umber Stone",
    finish: "Leather touch",
    image:
      "https://images.unsplash.com/photo-1633299264475-e8796606b870?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Pearl Drift",
    finish: "Pearlescent",
    image:
      "https://images.unsplash.com/photo-1694378061058-bb6532de3bba?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Forest Grain",
    finish: "Deep texture",
    image:
      "https://images.unsplash.com/photo-1554381316-14cf94cbe791?auto=format&fit=crop&w=1000&q=86",
  },
  {
    name: "Calacatta Mist",
    finish: "Silk",
    image:
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?auto=format&fit=crop&w=1000&q=86",
  },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smooth(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

export default function App() {
  const [activeFinish, setActiveFinish] = useState(0);
  const sceneRef = useRef<HTMLElement>(null);
  const sheetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let layout = {
      visibleCount: surfaces.length,
      columns: 4,
      rows: 3,
      finalWidth: 0,
      finalHeight: 0,
      initialScaleX: 1,
      initialScaleY: 1,
      xGap: 0,
      yGap: 0,
    };

    const updateLayout = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth < 700;
      const visibleCount = isMobile ? 8 : surfaces.length;
      const columns = isMobile ? 2 : 4;
      const rows = Math.ceil(visibleCount / columns);
      const finalWidth = isMobile ? viewportWidth * 0.43 : Math.min(viewportWidth * 0.21, 340);
      const finalHeight = isMobile ? viewportHeight * 0.16 : Math.min(viewportHeight * 0.235, 240);
      const initialWidth = Math.min(viewportWidth * 0.88, 1180);
      const initialHeight = viewportHeight * (isMobile ? 0.68 : 0.76);

      layout = {
        visibleCount,
        columns,
        rows,
        finalWidth,
        finalHeight,
        initialScaleX: initialWidth / finalWidth,
        initialScaleY: initialHeight / finalHeight,
        xGap: isMobile ? viewportWidth * 0.465 : finalWidth + 18,
        yGap: isMobile ? viewportHeight * 0.178 : finalHeight + 18,
      };

      sheetRefs.current.forEach((sheet, index) => {
        if (!sheet) return;
        sheet.style.display = index < visibleCount ? "block" : "none";
        sheet.style.width = `${finalWidth}px`;
        sheet.style.height = `${finalHeight}px`;
      });
    };

    const render = () => {
      rafId = 0;
      const scene = sceneRef.current;
      if (!scene) return;

      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const rawProgress = clamp(-rect.top / travel);
      const progress = smooth(rawProgress);

      sheetRefs.current.forEach((sheet, index) => {
        if (!sheet) return;
        if (index >= layout.visibleCount) return;

        const column = index % layout.columns;
        const row = Math.floor(index / layout.columns);
        const targetX = (column - (layout.columns - 1) / 2) * layout.xGap;
        const targetY = (row - (layout.rows - 1) / 2) * layout.yGap;
        const delay = index === 0 ? 0 : 0.08 + index * 0.016;
        const reveal = smooth(clamp((rawProgress - delay) / 0.48));
        const spread = index === 0 ? progress : reveal;
        const depthX = index === 0 ? 0 : ((index % 3) - 1) * 16;
        const depthY = index === 0 ? 0 : (index % 2 ? 12 : -12);
        const labelOpacity = smooth(clamp((rawProgress - 0.6) / 0.25));
        const scaleX = index === 0 ? layout.initialScaleX + (1 - layout.initialScaleX) * progress : 1;
        const scaleY = index === 0 ? layout.initialScaleY + (1 - layout.initialScaleY) * progress : 1;

        sheet.style.opacity = `${index === 0 ? 1 : reveal}`;
        sheet.style.transform = `translate3d(${depthX * (1 - spread) + targetX * spread}px, ${depthY * (1 - spread) + targetY * spread}px, 0) scale(${scaleX}, ${scaleY})`;
        sheet.style.zIndex = `${surfaces.length - index}`;
        sheet.style.setProperty("--label-opacity", `${labelOpacity}`);
      });

      if (introRef.current) {
        introRef.current.style.opacity = `${clamp(1 - rawProgress * 4.2)}`;
        introRef.current.style.transform = `translate3d(0, ${-rawProgress * 42}px, 0)`;
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${rawProgress})`;
      }
    };

    const schedule = () => {
      if (rafId === 0) {
        rafId = requestAnimationFrame(render);
      }
    };

    updateLayout();
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    const handleResize = () => {
      updateLayout();
      schedule();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Mica Atelier home">
          <span className="brand-mark">M</span>
          <span>MICA ATELIER</span>
        </a>
        <div className="nav-links">
          <a href="#collection">Collection</a>
          <a href="#story">Our surfaces</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="catalogue-link" href="#collection">
          Explore catalogue <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <section className="scroll-scene" id="top" ref={sceneRef}>
        <div className="sticky-stage">
          <div className="ambient-light" />
          <div className="sheet-stage" aria-label="A collection of decorative surface samples">
            {surfaces.map((surface, index) => (
              <div
                className={`mica-sheet ${index === 0 ? "hero-sheet" : ""}`}
                key={surface.name}
                ref={(element) => {
                  sheetRefs.current[index] = element;
                }}
              >
                <img src={surface.image} alt="" draggable="false" />
                <div className="material-wash" />
                <div className="sheet-label">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{surface.name}</strong>
                    <small>{surface.finish}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-copy" ref={introRef}>
            <p className="eyebrow">Decorative surfaces · Collection 2025</p>
            <h1>
              Surfaces that
              <br />
              <em>define spaces.</em>
            </h1>
            <p className="hero-description">
              Discover extraordinary mica textures and finishes crafted around your vision.
            </p>
            <a className="explore-button" href="#collection">
              Explore the collection <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="scroll-cue">
            <span>Scroll to reveal</span>
            <div className="progress-track">
              <div className="progress-fill" ref={progressRef} />
            </div>
          </div>
        </div>
      </section>

      <section className="collection-intro" id="collection">
        <p className="eyebrow">One material · infinite expression</p>
        <div className="intro-grid">
          <h2>
            Every surface tells
            <br />a different <em>story.</em>
          </h2>
          <div className="intro-copy">
            <p>
              From quiet mineral tones to expressive grain, our collection brings colour,
              pattern and tactile depth to the spaces you imagine.
            </p>
            <a href="#contact">View all finishes <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="footer-panel" id="story">
        <span>Gloss</span><span>Matte</span><span>Stone</span><span>Wood grain</span><span>Metallic</span>
      </section>

      <section className="featured-collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected surfaces · 01</p>
            <h2>Material,<br /><em>curated.</em></h2>
          </div>
          <p>
            A considered selection of surfaces made for kitchens, wardrobes, furniture and
            architectural details.
          </p>
        </div>
        <div className="product-grid">
          {surfaces.slice(0, 6).map((surface, index) => (
            <article className={`product-card product-card-${index + 1}`} key={`card-${surface.name}`}>
              <div className="product-image">
                <img src={surface.image} alt={`${surface.name} decorative surface`} />
                <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="product-action">View surface ↗</span>
              </div>
              <div className="product-meta">
                <h3>{surface.name}</h3>
                <span>{surface.finish}</span>
              </div>
            </article>
          ))}
        </div>
        <a className="outlined-link" href="#finish-lab">Discover the full collection <span>↗</span></a>
      </section>

      <section className="finish-lab" id="finish-lab">
        <div className="finish-visual">
          <img
            key={surfaces[activeFinish].name}
            src={surfaces[activeFinish].image}
            alt={`${surfaces[activeFinish].name} in ${surfaces[activeFinish].finish} finish`}
          />
          <div className="finish-light" />
          <p>Move through the finishes</p>
        </div>
        <div className="finish-content">
          <p className="eyebrow">Surface lab · 02</p>
          <h2>Feel the<br /><em>finish.</em></h2>
          <p className="finish-description">
            Light changes everything. Compare the character of gloss, stone, suede and
            satin surfaces in one focused material study.
          </p>
          <div className="finish-options" role="tablist" aria-label="Choose a finish">
            {surfaces.slice(0, 5).map((surface, index) => (
              <button
                className={activeFinish === index ? "active" : ""}
                key={`finish-${surface.finish}`}
                onClick={() => setActiveFinish(index)}
                role="tab"
                aria-selected={activeFinish === index}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {surface.finish}
              </button>
            ))}
          </div>
          <div className="selected-finish">
            <span>Selected surface</span>
            <strong>{surfaces[activeFinish].name}</strong>
          </div>
        </div>
      </section>

      <section className="applications">
        <div className="section-heading light-heading">
          <div>
            <p className="eyebrow">Applications · 03</p>
            <h2>Made for the<br /><em>way you live.</em></h2>
          </div>
          <p>
            See how considered surfaces bring warmth, rhythm and enduring character into
            everyday interiors.
          </p>
        </div>
        <div className="application-grid">
          <article className="application-card application-main">
            <img
              src="https://images.unsplash.com/photo-1758565810954-7c97ad680715?auto=format&fit=crop&w=1800&q=88"
              alt="Modern kitchen and dining interior with warm material finishes"
            />
            <div><span>01</span><h3>Kitchen & dining</h3><a href="#contact">Explore application ↗</a></div>
          </article>
          <article className="application-card">
            <img
              src="https://images.unsplash.com/photo-1627141440602-e9c1e5fd2fbf?auto=format&fit=crop&w=1200&q=88"
              alt="Minimal cabinetry with contrasting surfaces"
            />
            <div><span>02</span><h3>Cabinetry</h3><a href="#contact">Explore application ↗</a></div>
          </article>
          <article className="application-card">
            <img
              src="https://images.unsplash.com/photo-1644395175647-7fc09bdae7c1?auto=format&fit=crop&w=1200&q=88"
              alt="Contemporary interior with marble island"
            />
            <div><span>03</span><h3>Living spaces</h3><a href="#contact">Explore application ↗</a></div>
          </article>
        </div>
      </section>

      <section className="story-section">
        <p className="eyebrow">From surface to space · 04</p>
        <h2>One sheet.<br />A thousand <em>possibilities.</em></h2>
        <div className="story-steps">
          <article><span>01</span><h3>Choose the texture</h3><p>Begin with a grain, mineral pattern or solid colour that sets the tone.</p></article>
          <article><span>02</span><h3>Find the finish</h3><p>Explore how gloss, matte and tactile surfaces respond to light and touch.</p></article>
          <article><span>03</span><h3>Shape the space</h3><p>Apply your selection across furniture and interiors with confidence.</p></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">Start a conversation · 05</p>
          <h2>Found your<br />perfect <em>surface?</em></h2>
          <p>Tell us what you are creating. Our material team can help you compare colours, patterns and finishes.</p>
          <div className="contact-details">
            <span>Visit our showroom</span>
            <strong>Address available on request</strong>
            <span>Call the studio</span>
            <strong>Contact number coming soon</strong>
          </div>
        </div>
        <form className="enquiry-form" onSubmit={(event) => event.preventDefault()}>
          <label>Full name<input type="text" placeholder="Your name" /></label>
          <label>Email address<input type="email" placeholder="name@example.com" /></label>
          <label>I'm interested in
            <select defaultValue="">
              <option value="" disabled>Select a surface type</option>
              <option>Marble & stone</option><option>Wood grain</option>
              <option>Solid colour</option><option>Metallic finish</option>
            </select>
          </label>
          <label>Tell us about your project<textarea placeholder="Project type, preferred finish or design code" rows={4} /></label>
          <button type="submit">Prepare enquiry <span>↗</span></button>
          <small>This prototype does not send information. Connect a form service to enable submissions.</small>
        </form>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">M</span><span>MICA ATELIER</span></div>
        <p>Materials selected for remarkable interiors.</p>
        <a href="mailto:studio@micaatelier.example">studio@micaatelier.example</a>
      </footer>
    </main>
  );
}
