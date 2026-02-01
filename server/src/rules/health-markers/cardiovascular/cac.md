# Coronary Artery Calcium (CAC) Score Evaluation

This document describes the algorithms used to evaluate Coronary Artery Calcium (CAC) scores and calculate health scores in the `cac.nools` rules engine.

## What is CAC?

The Coronary Artery Calcium (CAC) score is a measurement of the amount of calcified plaque in the coronary arteries, obtained through a cardiac CT scan. It is a powerful predictor of cardiovascular disease risk.

- **Lower CAC** indicates less calcified plaque and lower cardiovascular risk
- **Higher CAC** indicates more calcified plaque and higher cardiovascular risk
- **CAC of 0** means no detectable calcified plaque, which is highly reassuring

## CAC Score Interpretation at a Glance

| CAC Score | Interpretation | Risk Level |
|-----------|----------------|------------|
| **0** | No detectable calcified plaque | Very low risk |
| **1-99** | Mild plaque burden | Individualized decisions |
| **100-399** | Moderate plaque burden | Statin usually recommended |
| **≥400** | Extensive plaque burden | High risk for events |

*Source: [Doc's Opinion - Coronary Calcium Score](https://www.docsopinion.com/coronary-calcium-score/)*

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(cac, age, sex)` function returns one of four status values based on the CAC score:

| Status | CAC Score Range | Description |
|--------|-----------------|-------------|
| `no.detectable.plaque` | 0 | No calcified plaque detected |
| `mild.plaque` | 1-99 | Mild plaque burden |
| `moderate.plaque` | 100-399 | Moderate plaque burden |
| `extensive.plaque` | ≥400 | Extensive plaque burden |

### Algorithm

```
if CAC = 0 → "no.detectable.plaque"
if CAC 1-99 → "mild.plaque"
if CAC 100-399 → "moderate.plaque"
if CAC ≥ 400 → "extensive.plaque"
```

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(cac, age, sex)` function returns a health score from **0** (worst) to **1000** (best). Unlike other health markers where higher measurements are better, CAC scoring is inverted because **lower CAC is better**.

### Score Ranges by Status

```
Score Distribution by CAC Status

1000 ┤ ████████████████████████████████ No plaque (CAC = 0)
     │
 999 ┤ ██████████████████████████████ Mild plaque starts
     │
 700 ┤ ████████████████████████ Mild plaque ends
     │
 699 ┤ ██████████████████ Moderate plaque starts
     │
 300 ┤ ██████████████ Moderate plaque ends
     │
 299 ┤ ████████████ Extensive plaque starts
     │
   0 ┼────────────────────────────────────────────────
         0     1-99    100-399    400+
        (none) (mild) (moderate) (extensive)
```

| CAC Status | CAC Range | Health Score Range |
|------------|-----------|-------------------|
| **No Detectable Plaque** | 0 | 1000 |
| **Mild Plaque** | 1-99 | 700-999 |
| **Moderate Plaque** | 100-399 | 300-699 |
| **Extensive Plaque** | ≥400 | 0-299 |

### Scoring Formulas

#### No Detectable Plaque (CAC = 0)
```
score = 1000
```

#### Mild Plaque (CAC 1-99)
```
progress = (CAC - 1) / 98
score = 999 - (progress × 299)
```
Score decreases linearly from 999 (CAC=1) to 700 (CAC=99).

#### Moderate Plaque (CAC 100-399)
```
progress = (CAC - 100) / 299
score = 699 - (progress × 399)
```
Score decreases linearly from 699 (CAC=100) to 300 (CAC=399).

#### Extensive Plaque (CAC ≥400)
```
excess = CAC - 400
decayFactor = e^(-excess / 500)
score = 299 × decayFactor
```
Score decreases exponentially from 299, approaching 0 as CAC increases beyond 400.

---

## Example Calculations

### Example 1: CAC Score of 0
- **Status:** `"no.detectable.plaque"`
- **Score:** 1000

### Example 2: CAC Score of 50
- **CAC 50** falls in "Mild Plaque" range (1-99)
- **Progress:** (50 - 1) / 98 = 0.5
- **Score:** 999 - (0.5 × 299) = 999 - 150 = **849**
- **Status:** `"mild.plaque"`

### Example 3: CAC Score of 200
- **CAC 200** falls in "Moderate Plaque" range (100-399)
- **Progress:** (200 - 100) / 299 = 0.334
- **Score:** 699 - (0.334 × 399) = 699 - 133 = **566**
- **Status:** `"moderate.plaque"`

### Example 4: CAC Score of 600
- **CAC 600** falls in "Extensive Plaque" range (≥400)
- **Excess:** 600 - 400 = 200
- **Decay Factor:** e^(-200/500) = e^(-0.4) = 0.67
- **Score:** 299 × 0.67 = **200**
- **Status:** `"extensive.plaque"`

### Example 5: CAC Score of 1000
- **CAC 1000** falls in "Extensive Plaque" range (≥400)
- **Excess:** 1000 - 400 = 600
- **Decay Factor:** e^(-600/500) = e^(-1.2) = 0.30
- **Score:** 299 × 0.30 = **90**
- **Status:** `"extensive.plaque"`

---

## Clinical Context

### When to Get a CAC Score
A CAC score is most useful for:
- Intermediate cardiovascular risk patients (10-20% 10-year risk)
- Patients uncertain about starting statin therapy
- Risk stratification when traditional risk factors are borderline

### Limitations
- A CAC of 0 does not guarantee absence of all plaque (soft/non-calcified plaque is not detected)
- CAC interpretation varies with age and sex (percentile-based comparisons are more personalized)
- CAC measures cumulative plaque burden, not acute risk

### Management Implications

| CAC Score | Typical Recommendation |
|-----------|----------------------|
| 0 | Reassuring; lifestyle measures, consider deferring statin |
| 1-99 | Individualized discussion about statin therapy |
| 100-399 | Statin therapy usually recommended |
| ≥400 | Strong indication for aggressive risk factor management |

---

## References

1. Doc's Opinion. (2024). *Coronary Calcium Score - The CAC Test*. https://www.docsopinion.com/coronary-calcium-score/

2. Greenland, P., et al. (2018). 2018 Cholesterol Clinical Practice Guidelines: A Report of the American College of Cardiology/American Heart Association Task Force on Clinical Practice Guidelines. *Journal of the American College of Cardiology*, 71(19), e127-e248.

3. Hecht, H., et al. (2017). Clinical indications for coronary artery calcium scoring in asymptomatic patients: Expert consensus statement from the Society of Cardiovascular Computed Tomography. *Journal of Cardiovascular Computed Tomography*, 11(2), 157-168.
