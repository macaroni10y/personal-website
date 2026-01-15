/**
 * Initialize scroll-triggered animation for a section.
 * When the section enters the viewport, adds 'animate' class to all matching elements.
 */
export function initScrollAnimation(
  sectionSelector: string,
  animateSelectors: string | string[],
  options: IntersectionObserverInit = { threshold: 0.2 }
): void {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const selectors = Array.isArray(animateSelectors)
    ? animateSelectors.join(", ")
    : animateSelectors;
  const elements = section.querySelectorAll(selectors);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        elements.forEach((el) => el.classList.add("animate"));
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(section);
}

/**
 * Register an animation initialization function to run on page load.
 * Works with Astro's View Transitions.
 */
export function registerAnimation(initFn: () => void): void {
  document.addEventListener("astro:page-load", initFn);
}
