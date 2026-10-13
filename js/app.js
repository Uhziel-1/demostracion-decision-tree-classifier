// ==============================================================================
// DECISION TREE CLASSIFIER · MOTOR DE PRESENTACIÓN & INTERACTIVIDAD
// Diseñado para exposición oral tipo diapositivas (PPT Deck)
// ==============================================================================

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
let chartsInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
  initSlideEngine();
  initKaTeX();
  initLucide();
  initClinicalSimulator();
});

// ------------------------------------------------------------------------------
// 1. MOTOR DE DIAPOSITIVAS (PPT SLIDE ENGINE)
// ------------------------------------------------------------------------------
function initSlideEngine() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const counterEl = document.getElementById("slide-counter");
  const progressEl = document.getElementById("progress-bar");
  const dotsContainer = document.getElementById("dots-container");
  const fsBtn = document.getElementById("fullscreen-btn");

  // Crear indicadores circulares (dots)
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

    // Actualizar contador y barra de progreso
    if (counterEl) {
      const padCurrent = String(currentSlide + 1).padStart(2, "0");
      const padTotal = String(totalSlides).padStart(2, "0");
      counterEl.textContent = `${padCurrent} / ${padTotal}`;
    }

    if (progressEl) {
      const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
      progressEl.style.width = `${progressPercent}%`;
    }

    // Actualizar botones
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    // Actualizar dots
    const dots = document.querySelectorAll(".dot-indicator");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });

    // Renderizar KaTeX y gráficos en la diapositiva activa
    setTimeout(() => {
      initKaTeX();
      initSlideCharts(currentSlide);
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

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    // Evitar interferencia si se interactúa con un input
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

  // Pantalla completa
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
// 2. CONFIGURACIÓN ROBUSTA DE KATEX
// ------------------------------------------------------------------------------
function initKaTeX() {
  if (typeof renderMathInElement === "function") {
    try {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false,
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
      });
    } catch (err) {
      console.warn("KaTeX render notice:", err);
    }
  }
}

// ------------------------------------------------------------------------------
// 3. ICONOS LUCIDE
// ------------------------------------------------------------------------------
function initLucide() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

// ------------------------------------------------------------------------------
// 4. GRÁFICOS INTERACTIVOS CON CHART.JS (LAZY INIT POR DIAPOSITIVA)
// ------------------------------------------------------------------------------
let giniChartInstance = null;
let complexityChartInstance = null;
let importanceChartInstance = null;

function initSlideCharts(slideIndex) {
  if (typeof Chart === "undefined") return;

  // Diapositiva 4: Gini vs Entropía
  if (slideIndex === 3) {
    if (giniChartInstance) {
      giniChartInstance.resize();
      return;
    }
    const ctx = document.getElementById("giniEntropyChart");
    if (ctx) {
      const pVals = [];
      const giniVals = [];
      const entropyVals = [];
      for (let p = 0; p <= 1.001; p += 0.02) {
        const roundedP = Math.round(p * 100) / 100;
        pVals.push(roundedP.toFixed(2));
        const g = 2 * roundedP * (1 - roundedP);
        giniVals.push(g);
        let ent = 0;
        if (roundedP > 0 && roundedP < 1) {
          ent = -0.5 * (roundedP * Math.log2(roundedP) + (1 - roundedP) * Math.log2(1 - roundedP));
        }
        entropyVals.push(ent);
      }

      giniChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: pVals,
          datasets: [
            {
              label: "Gini: 2p(1-p)",
              data: giniVals,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.3
            },
            {
              label: "Entropía Escalada: ½ H(p)",
              data: entropyVals,
              borderColor: "#10b981",
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#cbd5e1", font: { family: "Plus Jakarta Sans", size: 12 } } },
            tooltip: { mode: "index", intersect: false }
          },
          scales: {
            x: {
              title: { display: true, text: "Probabilidad p de la clase positiva", color: "#94a3b8" },
              ticks: { color: "#64748b", maxTicksLimit: 11 },
              grid: { color: "rgba(255, 255, 255, 0.05)" }
            },
            y: {
              title: { display: true, text: "Medida de Impureza", color: "#94a3b8" },
              ticks: { color: "#64748b" },
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              min: 0,
              max: 0.55
            }
          }
        }
      });
    }
  }

  // Diapositiva 6: Curva de Complejidad (Sobreajuste vs Profundidad)
  if (slideIndex === 5) {
    if (complexityChartInstance) {
      complexityChartInstance.resize();
      return;
    }
    const ctx = document.getElementById("complexityChart");
    if (ctx) {
      complexityChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["1", "2", "3 (Óptimo)", "4", "5", "6", "8", "10", "Sin Poda"],
          datasets: [
            {
              label: "Entrenamiento (Train)",
              data: [76.9, 81.8, 85.1, 91.7, 95.5, 98.3, 100.0, 100.0, 100.0],
              borderColor: "#94a3b8",
              borderDash: [4, 4],
              borderWidth: 2,
              tension: 0.2
            },
            {
              label: "Prueba (Test Generalización)",
              data: [75.4, 80.3, 86.89, 81.9, 78.7, 75.4, 73.8, 73.8, 73.8],
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              borderWidth: 3,
              pointRadius: [4, 5, 8, 5, 4, 4, 4, 4, 4],
              pointBackgroundColor: ["#38bdf8", "#38bdf8", "#10b981", "#38bdf8", "#38bdf8", "#38bdf8", "#38bdf8", "#38bdf8", "#f43f5e"],
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#cbd5e1", font: { family: "Plus Jakarta Sans", size: 12 } } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } }
          },
          scales: {
            x: {
              title: { display: true, text: "Profundidad Máxima del Árbol (max_depth)", color: "#94a3b8" },
              ticks: { color: "#64748b" },
              grid: { color: "rgba(255, 255, 255, 0.05)" }
            },
            y: {
              title: { display: true, text: "Exactitud (%)", color: "#94a3b8" },
              ticks: { color: "#64748b" },
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              min: 70,
              max: 102
            }
          }
        }
      });
    }
  }

  // Diapositiva 7: Importancia de Atributos CART (Cleveland)
  if (slideIndex === 6) {
    if (importanceChartInstance) {
      importanceChartInstance.resize();
      return;
    }
    const ctx = document.getElementById("importanceChart");
    if (ctx) {
      importanceChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["thal (Perfusión)", "cp (Dolor)", "ca (Fluoroscopia)", "oldpeak (ST)", "age (Edad)", "chol / otros"],
          datasets: [
            {
              label: "Importancia de Reducción Gini (%)",
              data: [53.69, 19.41, 16.88, 10.02, 0.0, 0.0],
              backgroundColor: [
                "#38bdf8",
                "#0284c7",
                "#10b981",
                "#f59e0b",
                "rgba(148, 163, 184, 0.2)",
                "rgba(148, 163, 184, 0.2)"
              ],
              borderRadius: 8
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` Importancia Gini: ${ctx.raw}%` } }
          },
          scales: {
            x: {
              title: { display: true, text: "Porcentaje de Reducción Total de Impureza (%)", color: "#94a3b8" },
              ticks: { color: "#64748b" },
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              max: 60
            },
            y: {
              ticks: { color: "#cbd5e1", font: { family: "Plus Jakarta Sans", weight: "600" } },
              grid: { display: false }
            }
          }
        }
      });
    }
  }
}

// ------------------------------------------------------------------------------
// 5. SIMULADOR CLÍNICO EN TIEMPO REAL (DIAPOSITIVA 9)
// ------------------------------------------------------------------------------
function initClinicalSimulator() {
  const thalSlider = document.getElementById("sim-thal");
  const cpSlider = document.getElementById("sim-cp");
  const caSlider = document.getElementById("sim-ca");
  const oldpeakSlider = document.getElementById("sim-oldpeak");

  const thalVal = document.getElementById("val-thal");
  const cpVal = document.getElementById("val-cp");
  const caVal = document.getElementById("val-ca");
  const oldpeakVal = document.getElementById("val-oldpeak");

  const badgeDisplay = document.getElementById("sim-badge-display");
  const resultTitle = document.getElementById("sim-result-title");
  const resultDesc = document.getElementById("sim-result-desc");
  const resultPath = document.getElementById("sim-path-trace");

  if (!thalSlider || !cpSlider || !caSlider || !oldpeakSlider) return;

  const thalMap = { 3: "Normal (3)", 6: "Defecto Fijo (6)", 7: "Defecto Reversible (7)" };
  const cpMap = { 1: "Angina Típica (1)", 2: "Angina Atípica (2)", 3: "No Anginoso (3)", 4: "Asintomático (4)" };

  function evaluatePatient() {
    const thal = parseInt(thalSlider.value);
    const cp = parseInt(cpSlider.value);
    const ca = parseInt(caSlider.value);
    const oldpeak = parseFloat(oldpeakSlider.value);

    thalVal.textContent = thalMap[thal] || thal;
    cpVal.textContent = cpMap[cp] || cp;
    caVal.textContent = `${ca} vaso(s)`;
    oldpeakVal.textContent = `${oldpeak.toFixed(1)} mm`;

    let path = [];
    let isDisease = false;
    let prob = 0;

    // Regla exacta del árbol con max_depth=3 extraída de scikit-learn
    // Raíz: thal <= 4.5 (Normal = 3)
    if (thal <= 4.5) {
      path.push("Raíz: thal ≤ 4.5 (Talasemia Normal)");
      // Nodo izquierdo: ca <= 0.5
      if (ca <= 0.5) {
        path.push("Nodo 1: ca ≤ 0.5 (0 Vasos coloreados)");
        if (oldpeak <= 1.5) {
          path.push("Nodo 2: oldpeak ≤ 1.5 mm → Hoja Terminal");
          isDisease = false;
          prob = 4.3; // 95.7% sano
        } else {
          path.push("Nodo 2: oldpeak > 1.5 mm → Hoja Terminal");
          isDisease = true;
          prob = 62.5;
        }
      } else {
        path.push(`Nodo 1: ca > 0.5 (${ca} Vasos con fluoroscopia)`);
        if (cp <= 3.5) {
          path.push("Nodo 2: cp ≤ 3.5 (Dolor anginoso no silente)");
          isDisease = false;
          prob = 33.3;
        } else {
          path.push("Nodo 2: cp > 3.5 (Asintomático de alto riesgo)");
          isDisease = true;
          prob = 84.6;
        }
      }
    } else {
      path.push(`Raíz: thal > 4.5 (Defecto Severo en Perfusión: ${thal})`);
      if (cp <= 3.5) {
        path.push("Nodo 1: cp ≤ 3.5");
        if (ca <= 0.5) {
          path.push("Nodo 2: ca ≤ 0.5 → Hoja Terminal");
          isDisease = false;
          prob = 40.0;
        } else {
          path.push("Nodo 2: ca > 0.5 → Hoja Terminal");
          isDisease = true;
          prob = 88.9;
        }
      } else {
        path.push("Nodo 1: cp > 3.5 (Asintomático + Perfusión Dañada)");
        path.push("Ruta crítica directa → Hoja Terminal de Cardiopatía");
        isDisease = true;
        prob = 91.7; // 91.7% cardiopatía
      }
    }

    // Actualizar visualización
    if (badgeDisplay && resultTitle && resultDesc && resultPath) {
      badgeDisplay.className = `result-badge-display ${isDisease ? "disease" : "healthy"}`;
      if (isDisease) {
        resultTitle.textContent = "Cardiopatía Detectada (Alto Riesgo)";
        resultDesc.textContent = `Probabilidad Estimada por CART: ${prob.toFixed(1)}% de presencia de enfermedad coronaria.`;
      } else {
        resultTitle.textContent = "Bajo Riesgo / Sin Cardiopatía";
        resultDesc.textContent = `Probabilidad de Ausencia de Enfermedad: ${(100 - prob).toFixed(1)}%.`;
      }
      resultPath.innerHTML = path.map((step, idx) => `<div><b>Paso ${idx + 1}:</b> ${step}</div>`).join("");
    }
  }

  thalSlider.addEventListener("input", evaluatePatient);
  cpSlider.addEventListener("input", evaluatePatient);
  caSlider.addEventListener("input", evaluatePatient);
  oldpeakSlider.addEventListener("input", evaluatePatient);

  evaluatePatient();
}
