# Insulin Sensitivity Metrics for Non-Diabetic Individuals

## HOMA-IR (Homeostatic Model Assessment for Insulin Resistance)

HOMA-IR is a marker used to estimate insulin resistance, calculated using fasting glucose and fasting insulin levels.

### Formula

**If glucose is in mg/dL:**
```
HOMA-IR = (Fasting Glucose (mg/dL) × Fasting Insulin (µU/mL)) / 405
```

**If glucose is in mmol/L:**
```
HOMA-IR = (Fasting Glucose (mmol/L) × Fasting Insulin (µU/mL)) / 22.5
```

### HOMA-IR Interpretation

| Score | Interpretation |
|-------|----------------|
| < 1.0 | Optimal insulin sensitivity |
| 1.0 - 1.9 | Possible early or mild insulin resistance |
| 2.0 - 2.9 | Likely moderate insulin resistance |
| ≥ 3.0 | Likely significant insulin resistance |

> A HOMA-IR score above 2.5 typically indicates insulin resistance, although this threshold may vary based on population and clinical context.

## Fasting Insulin Levels

| Range | Interpretation |
|-------|----------------|
| < 8 µU/mL | Optimal |
| 2.6 - 24.9 µU/mL | Standard "normal" range |
| > 10-12 µU/mL | Red flag for insulin resistance |

### Reference Intervals by Sex

| Population | Range (µU/mL) | Range (pmol/L) |
|------------|---------------|----------------|
| Women | 2.54 - 13.30 | 15.3 - 80.12 |
| Men | 2.43 - 11.89 | 14.6 - 71.7 |
| Overall | 2.52 - 13.14 | 15.2 - 79.2 |

## QUICKI (Quantitative Insulin Sensitivity Check Index)

QUICKI is a mathematical transformation of fasting blood glucose and plasma insulin concentrations that provides a reliable index of insulin sensitivity.

### Formula

```
QUICKI = 1 / (Log(Fasting Insulin, µU/mL) + Log(Fasting Glucose, mg/dL))
```

## Important Notes

- Insulin and glucose values should be taken from a blood sample after a fast of 8-12 hours
- Non-fasting values may lead to inaccurate results
- HOMA-IR can detect insulin resistance years before fasting glucose becomes abnormal
- The glucose clamp method is the reference standard for direct measurement of insulin sensitivity

## Sources

- [MDCalc - HOMA-IR Calculator](https://www.mdcalc.com/calc/3120/homa-ir-homeostatic-model-assessment-insulin-resistance)
- [NCBI Bookshelf - Assessing Insulin Sensitivity and Resistance in Humans](https://www.ncbi.nlm.nih.gov/books/NBK278954/)
- [PMC - Proposal for fasting insulin and HOMA-IR reference intervals](https://pmc.ncbi.nlm.nih.gov/articles/PMC11554367/)
- [HealthMatters.io - HOMA-IR Metabolic Health](https://healthmatters.io/understand-blood-test-results/homa-ir)
