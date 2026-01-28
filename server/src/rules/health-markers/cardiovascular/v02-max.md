# VO2 Max Evaluation

This document describes the algorithms used to evaluate VO2 Max status and calculate health scores in the `v02-max.nools` rules engine.

## What is VO2 Max?

VO2 Max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during intense exercise. It is measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min) and is considered one of the best indicators of cardiovascular fitness and aerobic endurance.

- **Higher VO2 Max** indicates better cardiovascular fitness and aerobic capacity
- **Lower VO2 Max** may indicate poor cardiovascular health or a sedentary lifestyle

## VO2 Max Chart for Men (ml/kg/min)

| Fitness Level | 18-25 | 26-35 | 36-45 | 46-55 | 56-65 | 66+ |
|---------------|-------|-------|-------|-------|-------|-----|
| **Excellent** | >60 | >56 | >51 | >45 | >41 | >37 |
| **Good** | 52-60 | 49-56 | 43-51 | 39-45 | 36-41 | 33-37 |
| **Above Average** | 47-51 | 43-48 | 39-42 | 36-38 | 32-35 | 29-32 |
| **Average** | 42-46 | 40-42 | 35-38 | 32-35 | 30-31 | 26-28 |
| **Below Average** | 37-41 | 35-39 | 31-34 | 29-31 | 26-29 | 22-25 |
| **Poor** | 30-36 | 30-34 | 26-30 | 25-28 | 22-25 | 20-21 |
| **Very Poor** | <30 | <30 | <26 | <25 | <22 | <20 |

## VO2 Max Chart for Women (ml/kg/min)

| Fitness Level | 18-25 | 26-35 | 36-45 | 46-55 | 56-65 | 66+ |
|---------------|-------|-------|-------|-------|-------|-----|
| **Excellent** | >56 | >52 | >45 | >40 | >37 | >32 |
| **Good** | 47-56 | 45-52 | 38-45 | 34-40 | 32-37 | 28-32 |
| **Above Average** | 42-46 | 39-44 | 34-37 | 31-33 | 28-31 | 25-27 |
| **Average** | 38-41 | 35-38 | 31-33 | 28-30 | 25-27 | 22-24 |
| **Below Average** | 33-37 | 31-34 | 27-30 | 25-27 | 22-24 | 19-21 |
| **Poor** | 28-32 | 26-30 | 22-26 | 20-24 | 18-21 | 17-18 |
| **Very Poor** | <28 | <26 | <22 | <20 | <18 | <17 |

*Source: [Fitnescity - Understanding VO2 Max](https://www.fitnescity.com/understanding-vo2-max)*

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(v02Max, age, sex)` function returns one of seven status values based on age and sex-specific VO2 Max thresholds:

| Status | Description |
|--------|-------------|
| `very.poor` | VO2 Max is in the very poor range for age/sex group |
| `poor` | VO2 Max is in the poor range for age/sex group |
| `below.average` | VO2 Max is below average for age/sex group |
| `average` | VO2 Max is average for age/sex group |
| `above.average` | VO2 Max is above average for age/sex group |
| `good` | VO2 Max is good for age/sex group |
| `excellent` | VO2 Max is excellent/elite for age/sex group |

### Algorithm

1. Get age and sex-specific thresholds: `[veryPoorMax, poorMax, belowAvgMax, avgMax, aboveAvgMax, goodMax]`
2. Compare VO2 Max value against thresholds:
   - If `VO2Max <= veryPoorMax` → `"very.poor"`
   - If `VO2Max <= poorMax` → `"poor"`
   - If `VO2Max <= belowAvgMax` → `"below.average"`
   - If `VO2Max <= avgMax` → `"average"`
   - If `VO2Max <= aboveAvgMax` → `"above.average"`
   - If `VO2Max <= goodMax` → `"good"`
   - Otherwise → `"excellent"`

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(v02Max, age, sex)` function returns a score from **0** (worst) to **1000** (best) using linear interpolation within age and sex-specific VO2 Max ranges.

### Score Ranges by Status

```
Score Distribution by VO2 Max Status

1000 ┤ ████████████████████████████████ Excellent (max)
     │
 900 ┤ ████████████████████████████ Excellent threshold
     │
 800 ┤ ████████████████████████ Good
     │
 650 ┤ ██████████████████ Above Average
     │
 450 ┤ ████████████████ Average
     │
 300 ┤ ██████████ Below Average
     │
 150 ┤ ██████ Poor
     │
   0 ┼────────────────────────────────────────────────
       V.Poor  Poor  Below  Avg  Above  Good  Excellent
                      Avg         Avg
```

| Status | Score Range |
|--------|-------------|
| **Excellent** | 900-1000 |
| **Good** | 800-899 |
| **Above Average** | 650-799 |
| **Average** | 450-649 |
| **Below Average** | 300-449 |
| **Poor** | 150-299 |
| **Very Poor** | 0-149 |

### Scoring Formulas

#### Very Poor (0-149)
```
progress = VO2Max / veryPoorMax
score = progress × 149
```

#### Poor (150-299)
```
progress = (VO2Max - veryPoorMax) / (poorMax - veryPoorMax)
score = 150 + (progress × 149)
```

#### Below Average (300-449)
```
progress = (VO2Max - poorMax) / (belowAvgMax - poorMax)
score = 300 + (progress × 149)
```

#### Average (450-649)
```
progress = (VO2Max - belowAvgMax) / (avgMax - belowAvgMax)
score = 450 + (progress × 199)
```

#### Above Average (650-799)
```
progress = (VO2Max - avgMax) / (aboveAvgMax - avgMax)
score = 650 + (progress × 149)
```

#### Good (800-899)
```
progress = (VO2Max - aboveAvgMax) / (goodMax - aboveAvgMax)
score = 800 + (progress × 99)
```

#### Excellent (900-1000)
```
excess = VO2Max - goodMax
progress = min(excess / 10, 1)  // Caps at 10 units above threshold
score = 900 + (progress × 100)
```

---

## Example Calculations

### Example 1: 30-year-old Male with VO2 Max of 45
- **Thresholds for Men 26-35:** [29, 34, 39, 42, 48, 56]
- **VO2 Max 45** falls in "Above Average" range (43-48)
- **Progress:** (45 - 42) / (48 - 42) = 3/6 = 0.5
- **Score:** 650 + (0.5 × 149) = 650 + 75 = **725**
- **Status:** `"above.average"`

### Example 2: 50-year-old Female with VO2 Max of 35
- **Thresholds for Women 46-55:** [19, 24, 27, 30, 33, 40]
- **VO2 Max 35** falls in "Good" range (34-40)
- **Progress:** (35 - 33) / (40 - 33) = 2/7 = 0.286
- **Score:** 800 + (0.286 × 99) = 800 + 28 = **828**
- **Status:** `"good"`

### Example 3: 22-year-old Male with VO2 Max of 65
- **Thresholds for Men 18-25:** [29, 36, 41, 46, 51, 60]
- **VO2 Max 65** falls in "Excellent" range (>60)
- **Excess:** 65 - 60 = 5
- **Progress:** min(5 / 10, 1) = 0.5
- **Score:** 900 + (0.5 × 100) = 900 + 50 = **950**
- **Status:** `"excellent"`

---

## How to Measure VO2 Max

### Laboratory Testing (Most Accurate)
- Graded exercise test on a treadmill or cycle ergometer
- Direct measurement of oxygen consumption via metabolic cart
- Considered the gold standard

### Field Tests
- **Cooper 12-minute run test** - Distance covered in 12 minutes
- **Beep test (20m shuttle run)** - Multi-stage fitness test
- **Rockport Walk Test** - 1-mile walk test

### Wearable Devices
- Many fitness watches estimate VO2 Max using heart rate data
- Less accurate but convenient for tracking trends

---

## Factors Affecting VO2 Max

### Genetic Factors
- Baseline VO2 Max is partially determined by genetics
- Response to training also has a genetic component

### Trainable Factors
- **Aerobic training** - Regular cardio exercise improves VO2 Max
- **High-intensity interval training (HIIT)** - Effective for improving VO2 Max
- **Consistency** - Regular training over months/years

### Lifestyle Factors
- **Age** - VO2 Max naturally declines ~1% per year after age 25
- **Body composition** - Higher body fat reduces relative VO2 Max
- **Altitude** - Living/training at altitude can improve VO2 Max
- **Smoking** - Significantly reduces VO2 Max

---

## References

1. Fitnescity. (2024). *Understanding VO2 Max - VO2 Max Charts by Age and Gender*. https://www.fitnescity.com/understanding-vo2-max

2. American College of Sports Medicine. (2018). *ACSM's Guidelines for Exercise Testing and Prescription* (10th ed.). Wolters Kluwer.

3. Bassett, D. R., & Howley, E. T. (2000). Limiting factors for maximum oxygen uptake and determinants of endurance performance. *Medicine & Science in Sports & Exercise*, 32(1), 70-84.
