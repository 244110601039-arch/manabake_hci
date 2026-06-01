document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Optional: stop observing once visible
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
  });

  // Update active nav pill based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-pill a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute("id");
      }
    });

    // Ensure only ONE active link at a time
    navLinks.forEach(link => {
      link.classList.remove("active");
    });
    
    // Add active to correct link only
    navLinks.forEach(link => {
      if (link.getAttribute("href").includes(current) && current !== "") {
        link.classList.add("active");
      }
    });
  });

  // Remove focus state after link is clicked to prevent hover from disappearing
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // Let the browser handle navigation and scroll
      // Scroll event will update active state automatically
      setTimeout(() => link.blur(), 50);
    });
    
    // For mobile: prevent :active state from persisting
    link.addEventListener("touchend", (e) => {
      link.blur();
    });
  });
});
