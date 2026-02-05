# Small Dense LDL (sdLDL) Evaluation

This document describes the algorithms used to evaluate Small Dense LDL (sdLDL) status and calculate health scores in the `sdldl.nools` rules engine.

## What is sdLDL?

Small Dense LDL (sdLDL) is a subtype of low-density lipoprotein cholesterol characterized by smaller, denser particles. These particles are considered more atherogenic (likely to cause plaque buildup in arteries) than larger, buoyant LDL particles.

- **Lower sdLDL** is better and associated with reduced cardiovascular risk
- **Higher sdLDL** is associated with increased risk of coronary heart disease
- **Goal:** < 50.0 mg/dL for adults > 20 years
- sdLDL is used in conjunction with other lipid measurements for comprehensive cardiovascular risk assessment

---

## sdLDL Levels and Health Status

| sdLDL Range | Status | Description |
|-------------|--------|-------------|
| **< 30 mg/dL** | Optimal | Excellent; well below goal |
| **30-49.9 mg/dL** | Normal | At goal; within healthy range |
| **50-59.9 mg/dL** | Above Goal | Slightly elevated; above recommended threshold |
| **60-79.9 mg/dL** | Elevated | Moderately elevated; increased CV risk |
| **>= 80 mg/dL** | High | Significantly elevated; high CV risk |

*Source: [Cleveland HeartLab - sd-LDL Test](https://www.clevelandheartlab.com/tests/sd-ldl/)*

---

## Reference Intervals

Population reference intervals vary by age and sex:

| Age/Sex Group | Reference Interval |
|---------------|-------------------|
| Males 21-44 years | 12.7-48.3 mg/dL |
| Females 21-54 years | 12.7-48.3 mg/dL |
| Males 45-75 years | 12.6-51.7 mg/dL |
| Females 55-75 years | 12.6-51.7 mg/dL |

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(sdldl)` function returns one of five status values:

| Status | Description |
|--------|-------------|
| `optimal` | sdLDL < 30 mg/dL |
| `normal` | sdLDL 30-49.9 mg/dL |
| `above.goal` | sdLDL 50-59.9 mg/dL |
| `elevated` | sdLDL 60-79.9 mg/dL |
| `high` | sdLDL >= 80 mg/dL |

### Algorithm

```
1. If sdLDL < 30 → return "optimal"
2. If sdLDL < 50 → return "normal"
3. If sdLDL < 60 → return "above.goal"
4. If sdLDL < 80 → return "elevated"
5. Otherwise → return "high"
```

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(sdldl)` function returns a score from **0** (worst) to **1000** (best/optimal).

### Score Ranges by Status

```
Score Distribution by sdLDL Status (lower sdLDL = higher score)

1000 ┤ ████████████████████████████████ Near zero sdLDL
     │
 900 ┤ ████████████████████████████ Optimal threshold (30)
     │
 700 ┤ ██████████████████████ Normal (30-50)
     │
 400 ┤ ████████████████ Above Goal (50-60)
     │
 150 ┤ ██████████ Elevated (60-80)
     │
   0 ┼────────────────────────────────────────────────
         0    30    50    60    80    120   sdLDL mg/dL
```

| Status | Score Range |
|--------|-------------|
| **Optimal** (< 30 mg/dL) | 900-1000 |
| **Normal** (30-49.9 mg/dL) | 700-899 |
| **Above Goal** (50-59.9 mg/dL) | 400-699 |
| **Elevated** (60-79.9 mg/dL) | 150-399 |
| **High** (>= 80 mg/dL) | 0-149 |

### Scoring Formulas

#### Optimal (900-1000)
Score decreases linearly from 1000 at 0 mg/dL to 900 at 30 mg/dL.
```
progress = (30 - sdLDL) / 30
score = 900 + (progress × 100)
```

#### Normal (700-899)
Score decreases linearly from 899 at 30 mg/dL to 700 at 50 mg/dL.
```
range = 50 - 30  // 20
progress = (50 - sdLDL) / range
score = 700 + (progress × 199)
```

#### Above Goal (400-699)
Score decreases linearly from 699 at 50 mg/dL to 400 at 60 mg/dL.
```
range = 60 - 50  // 10
progress = (60 - sdLDL) / range
score = 400 + (progress × 299)
```

#### Elevated (150-399)
Score decreases linearly from 399 at 60 mg/dL to 150 at 80 mg/dL.
```
range = 80 - 60  // 20
progress = (80 - sdLDL) / range
score = 150 + (progress × 249)
```

#### High (0-149)
Score decreases linearly from 149 at 80 mg/dL to 0 at 120 mg/dL.
```
if sdLDL >= 120:
    score = 0
else:
    range = 120 - 80  // 40
    progress = (120 - sdLDL) / range
    score = progress × 149
```

---

## Example Calculations

### Example 1: Excellent Lipid Profile (sdLDL 18 mg/dL)
- **Status:** 18 < 30 → `"optimal"`
- **Score:**
  - progress = (30 - 18) / 30 = 0.4
  - score = 900 + (0.4 × 100) = **940**

### Example 2: Normal Range (sdLDL 40 mg/dL)
- **Status:** 30 <= 40 < 50 → `"normal"`
- **Score:**
  - progress = (50 - 40) / 20 = 0.5
  - score = 700 + (0.5 × 199) = **800**

### Example 3: Slightly Above Goal (sdLDL 52 mg/dL)
- **Status:** 50 <= 52 < 60 → `"above.goal"`
- **Score:**
  - progress = (60 - 52) / 10 = 0.8
  - score = 400 + (0.8 × 299) = **639**

### Example 4: Moderately Elevated (sdLDL 70 mg/dL)
- **Status:** 60 <= 70 < 80 → `"elevated"`
- **Score:**
  - progress = (80 - 70) / 20 = 0.5
  - score = 150 + (0.5 × 249) = **275**

### Example 5: High sdLDL (sdLDL 100 mg/dL)
- **Status:** 100 >= 80 → `"high"`
- **Score:**
  - progress = (120 - 100) / 40 = 0.5
  - score = 0.5 × 149 = **75**

---

## Why sdLDL Matters

### Atherogenic Properties

Small dense LDL particles are more harmful than larger LDL particles because they:

1. **Penetrate arterial walls more easily** - Their smaller size allows them to enter the arterial intima more readily
2. **Are more susceptible to oxidation** - Oxidized LDL is a key driver of atherosclerosis
3. **Have longer circulation time** - They are cleared more slowly from the bloodstream
4. **Bind less effectively to LDL receptors** - Leading to prolonged exposure in the bloodstream

### Association with Cardiovascular Disease

Research from the Atherosclerosis Risk in Communities (ARIC) study demonstrated that:
- Higher sdLDL concentrations predict risk for coronary heart disease
- sdLDL provides additional risk information beyond standard LDL cholesterol measurements
- Elevated sdLDL is often associated with metabolic syndrome and insulin resistance

---

## Factors Affecting sdLDL Levels

### Conditions Associated with Elevated sdLDL
- Type 2 diabetes and insulin resistance
- Metabolic syndrome
- Obesity, particularly abdominal obesity
- Hypertriglyceridemia (high triglycerides)
- Familial combined hyperlipidemia
- Chronic kidney disease
- Hypothyroidism

### Lifestyle Factors That May Lower sdLDL
- Weight loss (especially reducing visceral fat)
- Regular aerobic exercise
- Reducing refined carbohydrates and sugars
- Increasing dietary fiber
- Consuming omega-3 fatty acids
- Mediterranean-style diet

### Medications That May Lower sdLDL
- Statins
- Fibrates (particularly effective for sdLDL)
- Niacin
- Omega-3 fatty acid supplements
- PCSK9 inhibitors

---

## Testing Information

### Specimen Requirements
- **Specimen:** Serum
- **Volume:** 1.0 mL (minimum 0.2 mL)
- **Container:** Gel-barrier tube (SST)
- **Patient Preparation:** Fasting may be required

### Collection Procedure
1. Collect and label sample according to standard protocols
2. Gently invert tube 5 times immediately after draw (do not shake)
3. Allow blood to clot for 30 minutes
4. Centrifuge for 10 minutes
5. Store and transport refrigerated (2-8°C)

### Stability
- **Ambient:** Not acceptable
- **Refrigerated (2-8°C):** 10 days
- **Frozen (-20°C):** 14 days
- **Deep Frozen (-70°C):** 3 months

### Methodology
Enzymatic assay

---

## Clinical Interpretation

### When to Test sdLDL

Consider sdLDL testing for patients with:
- Normal LDL-C but other cardiovascular risk factors
- Metabolic syndrome or insulin resistance
- Family history of premature cardiovascular disease
- Elevated triglycerides
- Diabetes or prediabetes
- Patients not reaching treatment goals with standard therapy

### Using sdLDL in Risk Assessment

sdLDL should be interpreted in conjunction with:
- Total cholesterol
- LDL cholesterol
- HDL cholesterol
- Triglycerides
- Apolipoprotein B
- Lipoprotein(a)
- Inflammatory markers (hs-CRP)

### Treatment Considerations

If sdLDL is elevated:
1. Intensify lifestyle modifications
2. Consider adding or adjusting lipid-lowering therapy
3. Address underlying conditions (diabetes, metabolic syndrome)
4. Monitor response to treatment with follow-up testing

---

## Limitations

- sdLDL measurement is not universally standardized across all laboratories
- Results should be interpreted in clinical context with other risk factors
- Not all patients with elevated sdLDL will develop cardiovascular disease
- Some patients with normal sdLDL may still be at risk due to other factors

---

## References

1. Cleveland HeartLab. (2024). *sd-LDL Test*. https://www.clevelandheartlab.com/tests/sd-ldl/

2. Hoogeveen RC, Gaubatz JW, Sun W, et al. Small dense low-density lipoprotein-cholesterol concentrations predict risk for coronary heart disease: the Atherosclerosis Risk in Communities (ARIC) study. *Arterioscler Thromb Vasc Biol*. 2014 May;34(5):1069-77.

3. Ivanova EA, Myasoedova VA, Melnichenko AA, et al. Small Dense Low-Density Lipoprotein as Biomarker for Atherosclerotic Diseases. *Oxid Med Cell Longev*. 2017;2017:1273042.

4. Diffenderfer MR, Schaefer EJ. The composition and metabolism of large and small LDL. *Curr Opin Lipidol*. 2014;25(3):221-226.

5. National Lipid Association. (2024). *Clinical Lipidology: A Companion to Braunwald's Heart Disease*. Elsevier.
