# LP-IR (Lipoprotein Insulin Resistance) Score

## Overview

The LP-IR (Lipoprotein Insulin Resistance) Score is a blood test that measures insulin resistance using NMR (Nuclear Magnetic Resonance) spectroscopy to analyze lipoprotein particle characteristics. It provides an assessment of metabolic dysfunction that may precede the development of type 2 diabetes.

## LP-IR Score Range Table

| LP-IR Score | Risk Level | Interpretation | Recommendations |
|-------------|------------|----------------|-----------------|
| 0-45 | Low Risk | Minimal insulin resistance | Maintain a healthy lifestyle and monitor the score periodically. |
| 46-64 | Moderate Risk | Developing insulin resistance | Adopt a healthier diet and increase physical activity to lower risk. |
| 65-100 | High Risk | Significant insulin resistance | Consult with a healthcare professional for lifestyle changes, medications, or other interventions. |

## Scoring Algorithm

The LP-IR value (0-100 scale, where lower is better) is converted to a health score from 0 (worst) to 1000 (best) using linear interpolation within each risk range:

| LP-IR Range | Score Range | Status |
|-------------|-------------|--------|
| 0-45 | 1000-640 | Low Risk |
| 46-64 | 639-350 | Moderate Risk |
| 65-100 | 349-0 | High Risk |

### Formulas

- **LP-IR 0-45 (Low Risk)**: `score = 1000 - (lpir * 8)`
  - At 0: score = 1000
  - At 45: score = 640

- **LP-IR 46-64 (Moderate Risk)**: `score = 639 - ((lpir - 46) / 18 * 289)`
  - At 46: score = 639
  - At 64: score = 350

- **LP-IR 65-100 (High Risk)**: `score = 349 - ((lpir - 65) / 35 * 349)`
  - At 65: score = 349
  - At 100: score = 0

## Clinical Significance

- The LP-IR score identifies insulin resistance earlier than traditional markers like fasting glucose or HbA1c
- Elevated LP-IR is associated with increased risk for type 2 diabetes and cardiovascular disease
- The test analyzes lipoprotein particle sizes and concentrations, which change with insulin resistance
- Large VLDL particles and small LDL particles are associated with higher insulin resistance

## Important Notes

- The LP-IR score is measured using NMR LipoProfile testing
- Results should be interpreted in conjunction with other metabolic markers
- Lifestyle modifications (diet, exercise, weight loss) can improve LP-IR scores
- Serial testing can track metabolic health improvements over time

## Sources

- [The Healthy MD - LP-IR Score: Lipoprotein Insulin Resistance Assessment](https://thehealthymd.com/lp-ir-score-lipoprotein-insulin-resistance-assessment/)
- [Dr. Mariela Glandt on the LPIR Test](https://www.youtube.com/watch?v=F4skJoZ9OaM&t=181s) - Video discussion about using the LP-IR test to measure insulin resistance (starting at 3:01)
