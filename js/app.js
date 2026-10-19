// ==============================================================================
// DECISION TREE CLASSIFIER · MOTOR DE PRESENTACIÓN & ANIMACIONES ATÓMICAS
// Sincronización 1:1 con Cuaderno de Prácticas en 10 Pasos (IA 2026-2)
// ==============================================================================

let currentSlide = 0;
let totalSlides = 0;
let p5ChartInstance = null;
let p9ChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  initSlideEngine();
  initKaTeX();
  initLucide();
  initInteractiveSteps();
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

  // Crear dots indicadores
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
      triggerSlideSpecificInit(currentSlide);
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
// 2. CONFIGURACIÓN ROBUSTA DE KATEX & LUCIDE
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
// 3. INICIALIZADOR DE PASOS ATÓMICOS & MICRO-ANIMACIONES
// ------------------------------------------------------------------------------
function initInteractiveSteps() {
  initStep1();
  initStep2();
  initStep3();
  initStep4();
  initStep6();
  initStep7();
  initStep8();
  initStep10();
}

function triggerSlideSpecificInit(slideIndex) {
  // Slide 5 is Paso 5 (Index 5)
  if (slideIndex === 5) {
    initStep5Chart();
  }
  // Slide 9 is Paso 9 (Index 9)
  if (slideIndex === 9) {
    initStep9Chart();
  }
}

// ==============================================================================
// PASO 1: PIPELINE DE DATOS, NULOS Y BINARIZACIÓN
// ==============================================================================
function initStep1() {
  const box = document.getElementById("p1-stream-box");
  const msg = document.getElementById("p1-status-msg");
  if (!box) return;

  // Crear 28 dots representativos
  box.innerHTML = "";
  for (let i = 0; i < 28; i++) {
    const dot = document.createElement("div");
    dot.className = "data-dot";
    box.appendChild(dot);
  }

  const dots = box.querySelectorAll(".data-dot");

  document.getElementById("p1-btn-raw")?.addEventListener("click", () => {
    dots.forEach((d, i) => {
      d.className = "data-dot";
      // 3 dots marcados como nulos '?'
      if (i === 6 || i === 14 || i === 22) {
        d.classList.add("null-drop");
      }
    });
    if (msg) msg.innerHTML = '<span style="color:var(--accent-rose);">6 nulos detectados en ca y thal con valor "?"</span>';
  });

  document.getElementById("p1-btn-clean")?.addEventListener("click", () => {
    dots.forEach((d, i) => {
      d.className = "data-dot";
      if (i === 6 || i === 14 || i === 22) {
        d.classList.add("test"); // Imputados
      }
    });
    if (msg) msg.innerHTML = '<span style="color:var(--accent-amber);">Imputación: ca &rarr; mediana (0.0) | thal &rarr; moda (3.0)</span>';
  });

  document.getElementById("p1-btn-binarize")?.addEventListener("click", () => {
    dots.forEach((d, i) => {
      d.className = "data-dot";
      if (i % 2 === 0) {
        d.classList.add("healthy"); // Sano (0)
      } else {
        d.classList.add("sick"); // Cardiopatía (1)
      }
    });
    if (msg) msg.innerHTML = '<span style="color:var(--accent-emerald);">Binarizado: 54% Sanos (Verde) y 46% Cardiopatía (Rojo)</span>';
  });
}

// ==============================================================================
// PASO 2: PARTICIÓN TRAIN/TEST & ESTRATIFICACIÓN
// ==============================================================================
function initStep2() {
  const box = document.getElementById("p2-stream-box");
  const msg = document.getElementById("p2-status-msg");
  if (!box) return;

  box.innerHTML = "";
  for (let i = 0; i < 28; i++) {
    const dot = document.createElement("div");
    dot.className = "data-dot";
    box.appendChild(dot);
  }

  const dots = box.querySelectorAll(".data-dot");

  function renderSplit(stratified) {
    dots.forEach((d, i) => {
      d.className = "data-dot";
      // 80% train = 22 dots, 20% test = 6 dots
      if (i < 22) {
        d.classList.add("train");
      } else {
        d.classList.add("test");
      }
    });
    if (msg) {
      msg.innerHTML = stratified
        ? '<span style="color:var(--accent-emerald);">Estratificación Activa: Train (242) y Test (61) con 45.9% Cardiopatía exacto</span>'
        : '<span style="color:var(--accent-cyan);">random_state=42: Shuffling determinista fijado</span>';
    }
  }

  document.getElementById("p2-btn-shuffle")?.addEventListener("click", () => renderSplit(false));
  document.getElementById("p2-btn-stratify")?.addEventListener("click", () => renderSplit(true));

  renderSplit(true);
}

// ==============================================================================
// PASO 3: INVARIANZA DE ESCALA
// ==============================================================================
function initStep3() {
  const slider = document.getElementById("p3-slider");
  const scaleVal = document.getElementById("p3-scale-val");
  const sampleVal = document.getElementById("p3-sample-val");
  const threshVal = document.getElementById("p3-thresh-val");
  const ruleVal = document.getElementById("p3-rule-val");

  if (!slider) return;

  slider.addEventListener("input", (e) => {
    const factor = parseFloat(e.target.value);
    const scaledSample = (240 * factor).toFixed(1);
    const scaledThresh = (230 * factor).toFixed(1);

    if (scaleVal) scaleVal.textContent = `${factor.toFixed(1)}× (${factor === 1 ? "Crudo" : "Multiplicado"})`;
    if (sampleVal) sampleVal.textContent = `chol = ${scaledSample}`;
    if (threshVal) threshVal.textContent = `θ = ${scaledThresh}`;
    if (ruleVal) {
      ruleVal.innerHTML = `<span style="color:var(--accent-emerald);">${scaledSample} > ${scaledThresh} &rarr; EXACTAMENTE MISMA RAMA DERECHA</span>`;
    }
  });
}

// ==============================================================================
// PASO 4: CALCULADOR DINÁMICO DE GINI
// ==============================================================================
function initStep4() {
  const slider = document.getElementById("p4-slider");
  const p0Val = document.getElementById("p4-p0-val");
  const p1Val = document.getElementById("p4-p1-val");
  const result = document.getElementById("p4-gini-result");
  const state = document.getElementById("p4-gini-state");

  if (!slider) return;

  slider.addEventListener("input", (e) => {
    const p0 = parseInt(e.target.value) / 100;
    const p1 = 1 - p0;
    const gini = 1.0 - (p0 * p0 + p1 * p1);

    if (p0Val) p0Val.textContent = p0.toFixed(2);
    if (p1Val) p1Val.textContent = p1.toFixed(2);
    if (result) result.textContent = gini.toFixed(4);

    if (state) {
      if (gini < 0.1) {
        state.innerHTML = '<span style="color:var(--accent-emerald);">¡Nodo Casi Puro! (Gini &approx; 0.0)</span>';
      } else if (gini > 0.48) {
        state.innerHTML = '<span style="color:var(--accent-amber);">Nodo Muy Impuro (Máximo Desorden &approx; 0.5)</span>';
      } else {
        state.innerHTML = '<span style="color:var(--accent-cyan);">Incertidumbre Moderada</span>';
      }
    }
  });
}

// ==============================================================================
// PASO 5: CHART COMPARATIVO GINI VS ENTROPÍA
// ==============================================================================
function initStep5Chart() {
  const ctx = document.getElementById("p5-chart");
  if (!ctx || p5ChartInstance) return;

  const probs = [];
  const giniData = [];
  const entropyData = [];

  for (let i = 0; i <= 100; i += 5) {
    const p = i / 100;
    probs.push(p.toFixed(2));
    giniData.push(2 * p * (1 - p)); // Gini escalado
    if (p === 0 || p === 1) {
      entropyData.push(0);
    } else {
      // Shannon Entropy dividida entre 2 para igualar escala máxima en 0.5
      const h = -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)) * 0.5;
      entropyData.push(h);
    }
  }

  p5ChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: probs,
      datasets: [
        {
          label: "Impureza Gini (2p(1-p))",
          data: giniData,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: "Entropía Shannon (0.5 H(p))",
          data: entropyData,
          borderColor: "#10b981",
          backgroundColor: "transparent",
          borderDash: [4, 4],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#94a3b8", font: { size: 9, family: "'Plus Jakarta Sans', sans-serif" } }
        }
      },
      scales: {
        x: {
          display: true,
          ticks: { color: "#64748b", font: { size: 8 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          display: true,
          ticks: { color: "#64748b", font: { size: 8 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        }
      }
    }
  });
}

// ==============================================================================
// PASO 6: SOBREAJUSTE VS PRE-PODA
// ==============================================================================
function initStep6() {
  const btnOverfit = document.getElementById("p6-btn-overfit");
  const btnPruned = document.getElementById("p6-btn-pruned");
  const trAcc = document.getElementById("p6-train-acc");
  const teAcc = document.getElementById("p6-test-acc");
  const msg = document.getElementById("p6-state-msg");

  btnOverfit?.addEventListener("click", () => {
    if (trAcc) { trAcc.textContent = "100.0%"; trAcc.style.color = "var(--accent-rose)"; }
    if (teAcc) { teAcc.textContent = "73.8%"; teAcc.style.color = "var(--accent-rose)"; }
    if (msg) msg.innerHTML = '<span style="color:var(--accent-rose);">Árbol Libre: Memoriza ruido con 32 hojas &rarr; Brecha destructiva de 26.23%</span>';
  });

  btnPruned?.addEventListener("click", () => {
    if (trAcc) { trAcc.textContent = "84.3%"; trAcc.style.color = "var(--accent-emerald)"; }
    if (teAcc) { teAcc.textContent = "86.9%"; teAcc.style.color = "var(--accent-cyan)"; }
    if (msg) msg.innerHTML = '<span style="color:var(--accent-emerald);">Árbol Podado: Regularización óptima con 8 hojas &rarr; Generalización probada</span>';
  });
}

// ==============================================================================
// PASO 7: EXPLORADOR DE NODOS DEL ÁRBOL
// ==============================================================================
function initStep7() {
  const detail = document.getElementById("p7-node-detail");
  if (!detail) return;

  document.getElementById("p7-node-root")?.addEventListener("click", () => {
    detail.innerHTML = `
      <b style="color:var(--accent-cyan);">Nodo Raíz [thal &le; 4.5]</b><br>
      • Muestras: 242 pacientes | Gini: 0.497<br>
      • Distribución: [131 Sanos, 111 Cardiopatía]<br>
      • Criterio: Separa talasemia normal (3.0) de anomalías graves (6.0, 7.0).
    `;
  });

  document.getElementById("p7-node-left")?.addEventListener("click", () => {
    detail.innerHTML = `
      <b style="color:var(--accent-emerald);">Subárbol Izquierdo [ca &le; 0.5]</b><br>
      • Muestras: 134 pacientes con perfusión normal<br>
      • Diagnóstico predominante: 83% Probabilidad de Sano.<br>
      • Criterio clínico: Cero vasos fluoroscópicos obstruidos.
    `;
  });

  document.getElementById("p7-node-right")?.addEventListener("click", () => {
    detail.innerHTML = `
      <b style="color:var(--accent-rose);">Subárbol Derecho [cp &le; 3.5]</b><br>
      • Muestras: 108 pacientes con defecto de talio<br>
      • Diagnóstico predominante: 82% Cardiopatía confirmada.<br>
      • Criterio clínico: Angina inducida o dolor torácico asintomático.
    `;
  });
}

// ==============================================================================
// PASO 8: ALARMA CLÍNICA EN MATRIZ DE CONFUSIÓN
// ==============================================================================
function initStep8() {
  const alertBox = document.getElementById("p8-alert-box");
  if (!alertBox) return;

  document.getElementById("p8-btn-tn")?.addEventListener("click", () => {
    alertBox.innerHTML = '<b style="color:var(--accent-emerald);">Verdadero Negativo (29):</b> Paciente sano diagnosticado correctamente como sano. Coste: Ninguno, alta médica inmediata.';
  });

  document.getElementById("p8-btn-fp")?.addEventListener("click", () => {
    alertBox.innerHTML = '<b style="color:var(--accent-amber);">Falso Positivo (4):</b> Sano catalogado con cardiopatía. Coste: Ansiedad y un ecocardiograma de confirmación secundario.';
  });

  document.getElementById("p8-btn-fn")?.addEventListener("click", () => {
    alertBox.innerHTML = '<b style="color:var(--accent-rose);">¡Falso Negativo (4) - Alarma Médica Severa!:</b> Paciente con isquemia enviado a casa sin tratamiento. Riesgo letal inminente. Por eso el <b>Recall (85.71%)</b> es la prioridad médica.';
  });

  document.getElementById("p8-btn-tp")?.addEventListener("click", () => {
    alertBox.innerHTML = '<b style="color:var(--accent-emerald);">Verdadero Positivo (24):</b> Cardiopatía detectada a tiempo para angiografía y tratamiento médico preventivo.';
  });
}

// ==============================================================================
// PASO 9: CHART DE IMPORTANCIA DE CARACTERÍSTICAS
// ==============================================================================
function initStep9Chart() {
  const ctx = document.getElementById("p9-chart");
  if (!ctx || p9ChartInstance) return;

  p9ChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["thal (53.7%)", "cp (19.4%)", "ca (16.9%)", "oldpeak (6.7%)", "age (3.3%)"],
      datasets: [
        {
          label: "Importancia MDI Ponderada",
          data: [0.537, 0.194, 0.169, 0.067, 0.033],
          backgroundColor: [
            "#38bdf8",
            "#0ea5e9",
            "#0284c7",
            "#0369a1",
            "#075985"
          ],
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          max: 0.65,
          ticks: { color: "#64748b", font: { size: 8 } },
          grid: { color: "rgba(255, 255, 255, 0.05)" }
        },
        y: {
          ticks: { color: "#94a3b8", font: { size: 9, family: "'Fira Code', monospace" } },
          grid: { display: false }
        }
      }
    }
  });
}

// ==============================================================================
// PASO 10: SIMULADOR DE PACIENTE EN TIEMPO REAL
// ==============================================================================
function initStep10() {
  const selThal = document.getElementById("p10-sel-thal");
  const selCp = document.getElementById("p10-sel-cp");
  const title = document.getElementById("p10-res-title");
  const desc = document.getElementById("p10-res-desc");
  const badge = document.getElementById("p10-result-badge");

  if (!selThal || !selCp) return;

  function evaluatePatient() {
    const thal = parseFloat(selThal.value);
    const cp = parseFloat(selCp.value);

    // Lógica del árbol CART entrenado:
    // thal <= 4.5 -> Mayoritariamente sano excepto si ca/cp elevados
    // thal > 4.5  -> Mayoritariamente cardiopatía
    if (thal <= 4.5) {
      if (cp <= 3.5) {
        if (title) { title.textContent = "🟢 BAJO RIESGO (95.7%)"; title.style.color = "var(--accent-emerald)"; }
        if (desc) desc.textContent = "Ruta: thal ≤ 4.5 &rarr; cp ≤ 3.5 &rarr; Hoja Sana";
        if (badge) {
          badge.style.background = "rgba(16, 185, 129, 0.15)";
          badge.style.borderColor = "rgba(16, 185, 129, 0.35)";
        }
      } else {
        if (title) { title.textContent = "🟡 RIESGO MODERADO (60.0%)"; title.style.color = "var(--accent-amber)"; }
        if (desc) desc.textContent = "Ruta: thal ≤ 4.5 &rarr; cp asintomático &rarr; Seguimiento";
        if (badge) {
          badge.style.background = "rgba(245, 158, 11, 0.15)";
          badge.style.borderColor = "rgba(245, 158, 11, 0.35)";
        }
      }
    } else {
      if (title) { title.textContent = "🔴 ALTO RIESGO (98.0%)"; title.style.color = "var(--accent-rose)"; }
      if (desc) desc.textContent = "Ruta: thal > 4.5 (Defecto de Talio) &rarr; Hoja Isquémica";
      if (badge) {
        badge.style.background = "rgba(244, 63, 94, 0.15)";
        badge.style.borderColor = "rgba(244, 63, 94, 0.35)";
      }
    }
  }

  selThal.addEventListener("change", evaluatePatient);
  selCp.addEventListener("change", evaluatePatient);
}
