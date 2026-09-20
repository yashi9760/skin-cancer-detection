// HAM10000 Dataset - Skin Lesion Classification Data
const SKIN_CONDITIONS = {
  mel: {
    name: "Melanoma",
    fullName: "Melanoma (Malignant)",
    risk: "high",
    riskLabel: "HIGH RISK",
    color: "#ff4757",
    icon: "⚠️",
    prevalence: "~1.5% of skin cancers",
    description:
      "Melanoma is the most dangerous type of skin cancer, developing from pigment-containing cells called melanocytes. Early detection is critical for successful treatment.",
    symptoms: [
      "Asymmetrical shape",
      "Irregular or ragged borders",
      "Multiple or uneven colors",
      "Diameter larger than 6mm",
      "Evolving size, shape, or color",
    ],
    action:
      "Seek immediate medical attention. Schedule an appointment with a dermatologist or oncologist as soon as possible.",
    treatment:
      "Surgery, immunotherapy, targeted therapy, radiation therapy, chemotherapy",
    survivability: "98% if caught early (Stage I)",
    urgency: "URGENT",
  },
  bcc: {
    name: "Basal Cell Carcinoma",
    fullName: "Basal Cell Carcinoma",
    risk: "medium",
    riskLabel: "MEDIUM RISK",
    color: "#ffa502",
    icon: "⚡",
    prevalence: "~80% of all skin cancers",
    description:
      "The most common form of skin cancer. Basal cell carcinoma begins in the basal cells — a type of cell within the skin that produces new skin cells as old ones die off.",
    symptoms: [
      "Pearly or waxy bump",
      "Flat, flesh-colored or brown scar-like lesion",
      "Bleeding or scabbing sore that heals and returns",
      "Pink growth with raised edges",
      "Open sore that doesn't heal",
    ],
    action:
      "Schedule a consultation with a dermatologist within 2-4 weeks for proper evaluation and biopsy.",
    treatment: "Surgery, radiation, topical medications, photodynamic therapy",
    survivability: "99%+ if treated early",
    urgency: "SCHEDULE SOON",
  },
  akiec: {
    name: "Actinic Keratosis",
    fullName: "Actinic Keratosis / Intraepithelial Carcinoma",
    risk: "medium",
    riskLabel: "MEDIUM RISK",
    color: "#ffa502",
    icon: "⚡",
    prevalence: "~58 million Americans affected",
    description:
      "A rough, scaly patch on skin caused by years of sun exposure. Considered a precancerous condition as it can develop into squamous cell carcinoma if untreated.",
    symptoms: [
      "Rough, dry, scaly patch of skin",
      "Flat to slightly raised patch",
      "Hard, warty surface",
      "Itching, burning, or tenderness",
      "Color ranging from pink to red to brown",
    ],
    action:
      "Consult a dermatologist for evaluation. Treatment is recommended to prevent potential progression to cancer.",
    treatment: "Cryotherapy, topical medications, photodynamic therapy, laser",
    survivability: "Excellent if treated before malignant transformation",
    urgency: "MONITOR CLOSELY",
  },
  nv: {
    name: "Melanocytic Nevi",
    fullName: "Melanocytic Nevi (Common Mole)",
    risk: "low",
    riskLabel: "LOW RISK",
    color: "#2ed573",
    icon: "✓",
    prevalence: "Present in ~90% of adults",
    description:
      "Commonly known as moles, melanocytic nevi are benign (non-cancerous) growths on the skin that develop when pigment cells (melanocytes) grow in clusters. Most moles are harmless.",
    symptoms: [
      "Round or oval shape",
      "Smooth, uniform border",
      "Consistent brown, tan, or pink color",
      "Usually less than 6mm diameter",
      "Flat or raised surface",
    ],
    action:
      "Monitor for any changes (ABCDE criteria). Annual skin check recommended. No immediate treatment necessary.",
    treatment: "Usually no treatment needed. Monitoring recommended.",
    survivability: "Benign - excellent prognosis",
    urgency: "ROUTINE MONITORING",
  },
  bkl: {
    name: "Benign Keratosis",
    fullName: "Benign Keratosis-like Lesions",
    risk: "low",
    riskLabel: "LOW RISK",
    color: "#2ed573",
    icon: "✓",
    prevalence: "Very common, especially with age",
    description:
      "A group of benign skin conditions including seborrheic keratoses, solar lentigos, and lichen planus-like keratoses. These are non-cancerous skin growths that commonly appear with aging.",
    symptoms: [
      "Waxy, stuck-on appearance",
      "Light tan to black coloration",
      "Round or oval shape",
      "Flat or slightly elevated",
      "May have rough, warty surface",
    ],
    action:
      "No urgent action required. Cosmetic removal available if desired. Regular skin checks recommended.",
    treatment: "Optional: Cryotherapy, laser, or curettage for cosmetic purposes",
    survivability: "Benign - no cancer risk",
    urgency: "ROUTINE CHECK",
  },
  df: {
    name: "Dermatofibroma",
    fullName: "Dermatofibroma",
    risk: "low",
    riskLabel: "LOW RISK",
    color: "#2ed573",
    icon: "✓",
    prevalence: "Common benign skin tumor",
    description:
      "Dermatofibromas are common, benign skin tumors composed of fibrous tissue. They typically appear on the legs and are usually harmless. The exact cause is unknown.",
    symptoms: [
      "Small, hard bump under the skin",
      "Brown, pink, or tan coloration",
      "Usually 0.5-1.5 cm in diameter",
      "Dimples when pinched (Fitzpatrick sign)",
      "May be itchy or tender",
    ],
    action:
      "No treatment necessary unless symptomatic. Consult a dermatologist if concerned about appearance or if it changes.",
    treatment: "Usually no treatment needed. Surgical removal if bothersome.",
    survivability: "Benign - excellent prognosis",
    urgency: "ROUTINE CHECK",
  },
  vasc: {
    name: "Vascular Lesions",
    fullName: "Vascular Lesions",
    risk: "low",
    riskLabel: "LOW RISK",
    color: "#2ed573",
    icon: "✓",
    prevalence: "Common, affects all ages",
    description:
      "Vascular lesions are abnormalities of the blood vessels in the skin, including angiomas, angiokeratomas, pyogenic granulomas, and hemorrhage. Most are benign.",
    symptoms: [
      "Red, purple, or bluish coloration",
      "Flat or raised lesions",
      "May blanch when pressed",
      "Variable size",
      "Can bleed if traumatized",
    ],
    action:
      "Consult a dermatologist for proper diagnosis. Most are benign but some may require treatment.",
    treatment: "Laser therapy, sclerotherapy, surgical removal if necessary",
    survivability: "Usually benign - excellent prognosis",
    urgency: "ROUTINE CHECK",
  },
};

const ABCDE_CRITERIA = [
  {
    letter: "A",
    title: "Asymmetry",
    description:
      "One half of the mole doesn't match the other half in size, shape, or color.",
    icon: "⬡",
  },
  {
    letter: "B",
    title: "Border",
    description:
      "The edges are irregular, ragged, notched, or blurred instead of smooth.",
    icon: "◈",
  },
  {
    letter: "C",
    title: "Color",
    description:
      "The color is not the same throughout, with varying shades of brown, black, or pink.",
    icon: "◉",
  },
  {
    letter: "D",
    title: "Diameter",
    description:
      "The spot is larger than 6mm (about the size of a pencil eraser).",
    icon: "◎",
  },
  {
    letter: "E",
    title: "Evolving",
    description:
      "The mole is changing in size, shape, or color over time.",
    icon: "↻",
  },
];

export { SKIN_CONDITIONS, ABCDE_CRITERIA };
