// ==============================================================================
// DECISION TREE CLASSIFIER · MOTOR DE PRESENTACIÓN & VISOR PANZOOM
// Arquitectura 50/50: Captura Real con Zoom/Paneo + Explicación Fácil de Entender
// ==============================================================================

let currentSlide = 0;
let totalSlides = 0;

document.addEventListener("DOMContentLoaded", () => {
  initSlideEngine();
  initKaTeX();
  initLucide();
  initPanZoomViewers();
  initTabSwitchers();
});

// ------------------------------------------------------------------------------
// 1. MOTOR DE DIAPOSITIVAS (PPT SLIDE ENGINE)
// ------------------------------------------------------------------------------
function initSlideEngine() {
  const slides = document.querySelectorAll(".slide");
  totalSlides = slides.length;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const counterEl = document.getElementById("slide-counter");
  const progressEl = document.getElementById("progress-bar");
  const dotsContainer = document.getElementById("dots-container");
  const fsBtn = document.getElementById("fullscreen-btn");

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = `dot-indicator ${i === 0 ? "active" : ""}`;
      dot.title = `Diapositiva ${i + 1}`;
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlideUI() {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev");
      if (i === currentSlide) {
        slide.classList.add("active");
      } else if (i < currentSlide) {
        slide.classList.add("prev");
      }
    });

    if (counterEl) {
      const padCur = String(currentSlide + 1).padStart(2, "0");
      const padTot = String(totalSlides).padStart(2, "0");
      counterEl.textContent = `${padCur} / ${padTot}`;
    }

    if (progressEl) {
      const percent = ((currentSlide + 1) / totalSlides) * 100;
      progressEl.style.width = `${percent}%`;
    }

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    const dots = document.querySelectorAll(".dot-indicator");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });

    setTimeout(() => {
      initKaTeX();
      initLucide();
    }, 50);
  }

  window.goToSlide = function(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      updateSlideUI();
    }
  };

  window.nextSlide = function() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlideUI();
    }
  };

  window.prevSlide = function() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlideUI();
    }
  };

  if (prevBtn) prevBtn.addEventListener("click", window.prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", window.nextSlide);

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      window.nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") {
      e.preventDefault();
      window.prevSlide();
    } else if (e.key === "Home") {
      e.preventDefault();
      window.goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      window.goToSlide(totalSlides - 1);
    } else if (e.key.toLowerCase() === "f") {
      toggleFullscreen();
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (fsBtn) fsBtn.addEventListener("click", toggleFullscreen);

  updateSlideUI();
}

// ------------------------------------------------------------------------------
// 2. CONFIGURACIÓN DE KATEX & LUCIDE
// ------------------------------------------------------------------------------
function initKaTeX() {
  if (typeof renderMathInElement === "function") {
    try {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
    }
  }
}

function initLucide() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

// ------------------------------------------------------------------------------
// 3. MOTOR DE PAN & ZOOM INTERACTIVO PARA LAS CAPTURAS
// ------------------------------------------------------------------------------
function initPanZoomViewers() {
  const viewerCards = document.querySelectorAll(".viewer-card");

  viewerCards.forEach((card) => {
    const viewport = card.querySelector(".panzoom-viewport");
    const canvas = card.querySelector(".panzoom-canvas");
    const badge = card.querySelector(".zoom-badge");
    const btnIn = card.querySelector('[data-action="zoom-in"]');
    const btnOut = card.querySelector('[data-action="zoom-out"]');
    const btnReset = card.querySelector('[data-action="reset"]');

    if (!viewport || !canvas) return;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function applyTransform() {
      canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      if (badge) {
        badge.textContent = `${Math.round(scale * 100)}%`;
      }
    }

    function resetView() {
      scale = 1;
      translateX = 0;
      translateY = 0;
      applyTransform();
    }

    // Zoom con rueda del ratón
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newScale = scale * zoomFactor;

      if (newScale >= 0.7 && newScale <= 4.5) {
        scale = newScale;
        applyTransform();
      }
    }, { passive: false });

    // Drag / Paneo
    viewport.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      viewport.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      applyTransform();
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = "grab";
      }
    });

    // Doble clic para restablecer
    viewport.addEventListener("dblclick", resetView);

    // Botones de Zoom
    btnIn?.addEventListener("click", () => {
      if (scale < 4.0) {
        scale = Math.min(4.0, scale + 0.25);
        applyTransform();
      }
    });

    btnOut?.addEventListener("click", () => {
      if (scale > 0.7) {
        scale = Math.max(0.7, scale - 0.25);
        applyTransform();
      }
    });

    btnReset?.addEventListener("click", resetView);

    // Guardar referencia para resets externos
    card._resetPanzoom = resetView;
  });
}

// ------------------------------------------------------------------------------
// 4. PESTAÑAS PARA CELDAS DOBLES (CELL_7 Y CELL_9)
// ------------------------------------------------------------------------------
function initTabSwitchers() {
  const viewerCards = document.querySelectorAll(".viewer-card");

  viewerCards.forEach((card) => {
    const tabBtns = card.querySelectorAll(".tab-btn");
    const images = card.querySelectorAll(".panzoom-image");

    if (tabBtns.length === 0) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");

        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        images.forEach((img) => {
          if (img.id === targetId) {
            img.style.display = "block";
          } else {
            img.style.display = "none";
          }
        });

        // Restablecer zoom al cambiar de pestaña
        if (typeof card._resetPanzoom === "function") {
          card._resetPanzoom();
        }
      });
    });
  });
}
