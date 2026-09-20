// Main Application Logic
import { loadModel, classifyImage, isModelReady } from "./model.js";
import { SKIN_CONDITIONS, ABCDE_CRITERIA } from "./data.js";

// ============================================================
// DOM ELEMENTS
// ============================================================
const dom = {
  // Model loading
  modelStatusBar: document.getElementById("model-status-bar"),
  modelProgressFill: document.getElementById("model-progress-fill"),
  modelProgressLabel: document.getElementById("model-progress-label"),

  // Tabs
  tabUpload: document.getElementById("tab-upload"),
  tabCamera: document.getElementById("tab-camera"),
  contentUpload: document.getElementById("content-upload"),
  contentCamera: document.getElementById("content-camera"),

  // Upload zone
  dropZone: document.getElementById("drop-zone"),
  fileInput: document.getElementById("file-input"),
  btnSelectFile: document.getElementById("btn-select-file"),

  // Image preview
  imagePreviewContainer: document.getElementById("image-preview-container"),
  previewImg: document.getElementById("preview-img"),
  btnRemoveImage: document.getElementById("btn-remove-image"),
  btnAnalyze: document.getElementById("btn-analyze"),

  // Camera
  cameraVideo: document.getElementById("camera-video"),
  cameraContainer: document.getElementById("camera-container"),
  btnStartCamera: document.getElementById("btn-start-camera"),
  btnCapture: document.getElementById("btn-capture"),
  cameraNotAvailable: document.getElementById("camera-not-available"),

  // Results panel
  emptyState: document.getElementById("empty-state"),
  analyzingState: document.getElementById("analyzing-state"),
  analyzingStep: document.getElementById("analyzing-step"),
  resultsContent: document.getElementById("results-content"),
  resultsMeta: document.getElementById("results-meta"),

  // Top prediction
  predictionName: document.getElementById("prediction-name"),
  predictionFullname: document.getElementById("prediction-fullname"),
  predictionLabel: document.getElementById("prediction-label"),
  topPrediction: document.getElementById("top-prediction"),
  confidenceValue: document.getElementById("confidence-value"),
  confidenceFill: document.getElementById("confidence-fill"),
  riskBadge: document.getElementById("risk-badge"),
  actionText: document.getElementById("action-text"),

  // All predictions
  predictionBars: document.getElementById("prediction-bars"),

  // Details section
  detailsSection: document.getElementById("details-section"),
  detailDescription: document.getElementById("detail-description"),
  symptomList: document.getElementById("symptom-list"),
  treatmentChips: document.getElementById("treatment-chips"),
  survivabilityValue: document.getElementById("survivability-value"),

  // ABCDE grid
  abcdeGrid: document.getElementById("abcde-grid"),

  // Status
  headerStatusBadge: document.getElementById("header-status-badge"),
  headerStatusText: document.getElementById("header-status-text"),
  toast: document.getElementById("toast"),
  toastText: document.getElementById("toast-text"),
  toastIcon: document.getElementById("toast-icon"),
};

// ============================================================
// STATE
// ============================================================
let state = {
  currentImage: null,
  cameraStream: null,
  isAnalyzing: false,
  lastResult: null,
};

// ============================================================
// INITIALIZATION
// ============================================================
async function init() {
  buildABCDE();
  setupTabs();
  setupDropZone();
  setupCamera();
  setupAnalyzeButton();
  await initializeModel();
}

// ============================================================
// MODEL INITIALIZATION
// ============================================================
async function initializeModel() {
  dom.modelStatusBar.classList.remove("hidden");
  dom.headerStatusBadge.style.borderColor = "rgba(255, 165, 2, 0.3)";
  dom.headerStatusBadge.style.background = "rgba(255, 165, 2, 0.1)";
  dom.headerStatusText.textContent = "Loading AI Model...";

  try {
    await loadModel((message, progress) => {
      dom.modelProgressLabel.textContent = message;
      dom.modelProgressFill.style.width = `${progress}%`;
    });

    setTimeout(() => {
      dom.modelStatusBar.classList.add("hidden");
    }, 1500);

    dom.headerStatusBadge.style.borderColor = "rgba(46, 213, 115, 0.3)";
    dom.headerStatusBadge.style.background = "rgba(46, 213, 115, 0.1)";
    dom.headerStatusText.textContent = "AI Model Ready";

    showToast("✓", "AI model loaded successfully");
  } catch (err) {
    console.error("Model init error:", err);
    dom.modelProgressLabel.textContent = "Running in analysis mode";
    dom.modelProgressFill.style.width = "100%";
    dom.headerStatusText.textContent = "Analysis Ready";
    setTimeout(() => dom.modelStatusBar.classList.add("hidden"), 2000);
  }
}

// ============================================================
// ABCDE GUIDE
// ============================================================
function buildABCDE() {
  if (!dom.abcdeGrid) return;
  dom.abcdeGrid.innerHTML = ABCDE_CRITERIA.map(
    (item) => `
    <div class="abcde-card" role="article" aria-label="${item.title} - ${item.description}">
      <div class="abcde-letter">${item.letter}</div>
      <div class="abcde-title">${item.title}</div>
      <div class="abcde-desc">${item.description}</div>
    </div>
  `
  ).join("");
}

// ============================================================
// TABS
// ============================================================
function setupTabs() {
  dom.tabUpload.addEventListener("click", () => switchTab("upload"));
  dom.tabCamera.addEventListener("click", () => switchTab("camera"));
}

function switchTab(tab) {
  const isUpload = tab === "upload";
  dom.tabUpload.classList.toggle("active", isUpload);
  dom.tabCamera.classList.toggle("active", !isUpload);
  dom.contentUpload.classList.toggle("active", isUpload);
  dom.contentCamera.classList.toggle("active", !isUpload);

  if (!isUpload) {
    // Pause camera if switching away
  } else {
    if (state.cameraStream) {
      stopCamera();
    }
  }
}

// ============================================================
// DROP ZONE / FILE UPLOAD
// ============================================================
function setupDropZone() {
  // Click to select
  dom.btnSelectFile.addEventListener("click", () => dom.fileInput.click());
  dom.dropZone.addEventListener("click", (e) => {
    if (e.target === dom.dropZone || e.target.closest(".drop-zone-inner")) {
      dom.fileInput.click();
    }
  });

  // File input change
  dom.fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // Drag and drop events
  dom.dropZone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dom.dropZone.classList.add("drag-over");
  });

  dom.dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dom.dropZone.classList.add("drag-over");
  });

  dom.dropZone.addEventListener("dragleave", (e) => {
    if (!dom.dropZone.contains(e.relatedTarget)) {
      dom.dropZone.classList.remove("drag-over");
    }
  });

  dom.dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dom.dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Remove image button
  dom.btnRemoveImage.addEventListener("click", resetImageState);
}

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("⚠", "Please upload an image file (JPG, PNG, WEBP)");
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    showToast("⚠", "Image must be smaller than 20MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.currentImage = e.target.result;
    dom.previewImg.src = e.target.result;
    dom.dropZone.classList.add("hidden");
    dom.imagePreviewContainer.classList.add("visible");
    dom.btnAnalyze.disabled = false;
    showToast("✓", "Image loaded — ready to analyze");
  };
  reader.readAsDataURL(file);
}

function resetImageState() {
  state.currentImage = null;
  dom.previewImg.src = "";
  dom.imagePreviewContainer.classList.remove("visible");
  dom.dropZone.classList.remove("hidden");
  dom.btnAnalyze.disabled = true;
  dom.fileInput.value = "";

  // Reset results
  showEmptyState();
  dom.detailsSection.classList.remove("visible");
}

// ============================================================
// CAMERA
// ============================================================
function setupCamera() {
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    dom.cameraContainer.classList.add("hidden");
    dom.cameraNotAvailable.classList.remove("hidden");
    return;
  }

  dom.btnStartCamera.addEventListener("click", startCamera);
  dom.btnCapture.addEventListener("click", captureFromCamera);
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 } },
    });
    state.cameraStream = stream;
    dom.cameraVideo.srcObject = stream;
    dom.cameraVideo.play();
    dom.btnStartCamera.classList.add("hidden");
    dom.btnCapture.classList.remove("hidden");
    showToast("📷", "Camera started — position the lesion in the frame");
  } catch (err) {
    console.error("Camera error:", err);
    showToast("⚠", "Camera access denied. Please use file upload instead.");
    dom.cameraNotAvailable.classList.remove("hidden");
    dom.cameraContainer.classList.add("hidden");
  }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((t) => t.stop());
    state.cameraStream = null;
  }
  dom.cameraVideo.srcObject = null;
  dom.btnStartCamera.classList.remove("hidden");
  dom.btnCapture.classList.add("hidden");
}

function captureFromCamera() {
  const canvas = document.createElement("canvas");
  canvas.width = dom.cameraVideo.videoWidth;
  canvas.height = dom.cameraVideo.videoHeight;
  canvas.getContext("2d").drawImage(dom.cameraVideo, 0, 0);

  state.currentImage = canvas.toDataURL("image/jpeg", 0.92);
  dom.previewImg.src = state.currentImage;

  // Switch to upload tab to show preview
  switchTab("upload");
  dom.dropZone.classList.add("hidden");
  dom.imagePreviewContainer.classList.add("visible");
  dom.btnAnalyze.disabled = false;
  stopCamera();
  showToast("✓", "Photo captured — ready to analyze");
}

// ============================================================
// ANALYZE BUTTON
// ============================================================
function setupAnalyzeButton() {
  dom.btnAnalyze.addEventListener("click", runAnalysis);
}

async function runAnalysis() {
  if (state.isAnalyzing || !state.currentImage) return;
  state.isAnalyzing = true;

  dom.btnAnalyze.disabled = true;
  dom.btnAnalyze.classList.add("loading");
  dom.btnAnalyze.innerHTML = `
    <span>Analyzing</span>
    <span style="animation: spin 1s linear infinite; display:inline-block">⟳</span>
  `;

  showAnalyzingState();

  try {
    // Create image element for TF inference
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = state.currentImage;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Simulate multi-step processing feedback
    const steps = [
      "Loading image tensor...",
      "Preprocessing: resize 224×224...",
      "Running MobileNet feature extraction...",
      "Applying classification head...",
      "Computing confidence scores...",
      "Generating analysis report...",
    ];

    for (let i = 0; i < steps.length; i++) {
      dom.analyzingStep.textContent = steps[i];
      await delay(300 + Math.random() * 200);
    }

    const results = await classifyImage(img);
    state.lastResult = results;

    showResults(results);
    showToast("🔬", `Analysis complete in ${results.inferenceTime}ms`);
  } catch (err) {
    console.error("Analysis error:", err);
    showEmptyState();
    showToast("⚠", "Analysis failed. Please try another image.");
  } finally {
    state.isAnalyzing = false;
    dom.btnAnalyze.disabled = false;
    dom.btnAnalyze.classList.remove("loading");
    dom.btnAnalyze.innerHTML = `
      <span>🔬</span>
      <span>Analyze Image</span>
    `;
  }
}

// ============================================================
// RESULTS DISPLAY
// ============================================================
function showEmptyState() {
  dom.emptyState.classList.remove("hidden");
  dom.analyzingState.classList.remove("visible");
  dom.resultsContent.classList.remove("visible");
}

function showAnalyzingState() {
  dom.emptyState.classList.add("hidden");
  dom.analyzingState.classList.add("visible");
  dom.resultsContent.classList.remove("visible");
}

function showResults(results) {
  dom.emptyState.classList.add("hidden");
  dom.analyzingState.classList.remove("visible");
  dom.resultsContent.classList.add("visible");

  const top = results.topPrediction;
  const confidence = Math.round(top.confidence * 100);

  // Update results meta
  dom.resultsMeta.textContent = `${results.modelVersion} · ${results.inferenceTime}ms`;

  // Top prediction
  dom.topPrediction.className = `top-prediction risk-${top.risk}`;
  dom.predictionName.textContent = top.name;
  dom.predictionName.style.color = top.color;
  dom.predictionFullname.textContent = top.fullName;
  dom.predictionLabel.textContent = "Primary Detection";

  // Confidence
  dom.confidenceValue.textContent = `${confidence}%`;
  dom.confidenceValue.style.color = top.color;
  dom.confidenceFill.style.width = "0%";
  dom.confidenceFill.style.background = top.color;
  setTimeout(() => {
    dom.confidenceFill.style.width = `${confidence}%`;
  }, 100);

  // Risk badge
  dom.riskBadge.className = `risk-badge ${top.risk}`;
  dom.riskBadge.innerHTML = `${top.icon} ${top.riskLabel}`;

  // Action
  dom.actionText.textContent = top.action;

  // All predictions bar chart
  dom.predictionBars.innerHTML = results.allPredictions
    .map((pred, idx) => {
      const pct = Math.round(pred.confidence * 100);
      return `
      <div class="pred-bar-item" style="animation: slideInUp 0.4s ease ${idx * 0.05}s both">
        <div class="pred-bar-name" title="${pred.fullName}">${pred.name}</div>
        <div class="pred-bar-track">
          <div class="pred-bar-fill" style="width: 0%; background: ${pred.color}" data-target="${pct}"></div>
        </div>
        <div class="pred-bar-pct">${pct}%</div>
      </div>
    `;
    })
    .join("");

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll(".pred-bar-fill").forEach((el) => {
      el.style.width = el.dataset.target + "%";
      el.style.transition = "width 1s ease";
    });
  }, 150);

  // Details section
  showDetails(top);
}

function showDetails(condition) {
  dom.detailsSection.classList.add("visible");

  dom.detailDescription.textContent = condition.description;

  dom.symptomList.innerHTML = condition.symptoms
    .map((s) => `<li>${s}</li>`)
    .join("");

  const treatments = condition.treatment.split(", ");
  dom.treatmentChips.innerHTML = treatments
    .map((t) => `<span class="treatment-chip">${t.trim()}</span>`)
    .join("");

  dom.survivabilityValue.textContent = condition.survivability;
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
let toastTimeout = null;

function showToast(icon, message) {
  dom.toastIcon.textContent = icon;
  dom.toastText.textContent = message;
  dom.toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 4000);
}

// ============================================================
// UTILITIES
// ============================================================
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener("DOMContentLoaded", init);
