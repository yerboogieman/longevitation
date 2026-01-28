# Heart Rate Variability (HRV) Evaluation

This document describes the algorithms used to evaluate Heart Rate Variability (HRV) status and calculate health scores in the `hrv.nools` rules engine.

## What is HRV?

Heart Rate Variability (HRV) measures the variation in time between each heartbeat, specifically the variation in the R-R intervals (the time between successive heartbeats). It is measured in milliseconds (ms) using the RMSSD (Root Mean Square of Successive Differences) method.

- **Higher HRV** generally indicates better cardiovascular fitness, stress resilience, and recovery capacity
- **Lower HRV** may signal stress, fatigue, overtraining, or inadequate rest

## HRV Reference Table by Age (RMSSD in milliseconds)

The following reference table shows HRV ranges by age group:

| Age Group | Low | Below Avg | Average | Above Avg | Excellent | Elite |
|-----------|-----|-----------|---------|-----------|-----------|-------|
| **18-24** | 0-30 | 31-45 | 46-65 | 66-85 | 86-100 | 101+ |
| **25-29** | 0-28 | 29-42 | 43-60 | 61-78 | 79-95 | 96+ |
| **30-34** | 0-26 | 27-40 | 41-58 | 59-75 | 76-90 | 91+ |
| **35-39** | 0-25 | 26-38 | 39-55 | 56-72 | 73-88 | 89+ |
| **40-44** | 0-24 | 25-36 | 37-52 | 53-68 | 69-85 | 86+ |
| **45-49** | 0-22 | 23-34 | 35-50 | 51-65 | 66-82 | 83+ |
| **50-54** | 0-20 | 21-32 | 33-48 | 49-62 | 63-78 | 79+ |
| **55-59** | 0-19 | 20-30 | 31-45 | 46-60 | 61-75 | 76+ |
| **60-64** | 0-18 | 19-28 | 29-42 | 43-56 | 57-72 | 73+ |
| **65+** | 0-17 | 18-26 | 27-40 | 41-54 | 55-70 | 71+ |

*Source: [HealthEncyclo - HRV by Age Chart](https://www.healthencyclo.com/en/calculator/hrv-by-age-chart)*

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(milliseconds, age, sex)` function returns one of six status values based on age-specific HRV thresholds:

| Status | Description |
|--------|-------------|
| `low` | HRV is in the lowest range for age group |
| `below.average` | HRV is below average for age group |
| `average` | HRV is average for age group |
| `above.average` | HRV is above average for age group |
| `excellent` | HRV is excellent for age group |
| `elite` | HRV is in the elite/optimal range for age group |

### Algorithm

1. Get age-specific thresholds: `[lowMax, belowAvgMax, avgMax, aboveAvgMax, excellentMax]`
2. Compare HRV value against thresholds:
   - If `HRV <= lowMax` → `"low"`
   - If `HRV <= belowAvgMax` → `"below.average"`
   - If `HRV <= avgMax` → `"average"`
   - If `HRV <= aboveAvgMax` → `"above.average"`
   - If `HRV <= excellentMax` → `"excellent"`
   - Otherwise → `"elite"`

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(milliseconds, age, sex)` function returns a score from **0** (worst) to **1000** (best) using linear interpolation within age-specific HRV ranges.

### Score Ranges by Status

```
Score Distribution by HRV Status

1000 ┤ ████████████████████████████████ Elite (max)
     │
 900 ┤ ████████████████████████████ Elite threshold
     │
 800 ┤ ████████████████████████ Excellent
     │
 650 ┤ ██████████████████ Above Average
     │
 450 ┤ ████████████████ Average
     │
 200 ┤ ██████████ Below Average
     │
   0 ┼────────────────────────────────────────────────
         Low    Below   Avg   Above   Excellent  Elite
                 Avg           Avg
```

| Status | Score Range |
|--------|-------------|
| **Elite** | 900-1000 |
| **Excellent** | 800-899 |
| **Above Average** | 650-799 |
| **Average** | 450-649 |
| **Below Average** | 200-449 |
| **Low** | 0-199 |

### Scoring Formula

The score is calculated using linear interpolation within each status range:

#### Low (0-199)
```
progress = HRV / lowMax
score = progress × 199
```

#### Below Average (200-449)
```
progress = (HRV - lowMax) / (belowAvgMax - lowMax)
score = 200 + (progress × 249)
```

#### Average (450-649)
```
progress = (HRV - belowAvgMax) / (avgMax - belowAvgMax)
score = 450 + (progress × 199)
```

#### Above Average (650-799)
```
progress = (HRV - avgMax) / (aboveAvgMax - avgMax)
score = 650 + (progress × 149)
```

#### Excellent (800-899)
```
progress = (HRV - aboveAvgMax) / (excellentMax - aboveAvgMax)
score = 800 + (progress × 99)
```

#### Elite (900-1000)
```
excess = HRV - excellentMax
progress = min(excess / 50, 1)  // Caps at 50ms above threshold
score = 900 + (progress × 100)
```

---

## Example Calculations

### Example 1: 30-year-old with HRV of 55ms
- **Thresholds for age 30-34:** [26, 40, 58, 75, 90]
- **HRV 55ms** falls in "Average" range (41-58)
- **Progress:** (55 - 40) / (58 - 40) = 15/18 = 0.833
- **Score:** 450 + (0.833 × 199) = 450 + 166 = **616**
- **Status:** `"average"`

### Example 2: 55-year-old with HRV of 70ms
- **Thresholds for age 55-59:** [19, 30, 45, 60, 75]
- **HRV 70ms** falls in "Excellent" range (61-75)
- **Progress:** (70 - 60) / (75 - 60) = 10/15 = 0.667
- **Score:** 800 + (0.667 × 99) = 800 + 66 = **866**
- **Status:** `"excellent"`

### Example 3: 45-year-old with HRV of 90ms
- **Thresholds for age 45-49:** [22, 34, 50, 65, 82]
- **HRV 90ms** falls in "Elite" range (83+)
- **Excess:** 90 - 82 = 8ms
- **Progress:** min(8 / 50, 1) = 0.16
- **Score:** 900 + (0.16 × 100) = 900 + 16 = **916**
- **Status:** `"elite"`

---

## Factors Affecting HRV

For accurate HRV measurements, consider these factors:

### Measurement Best Practices
- Measure at the same time daily, ideally first thing in the morning
- Measure before consuming caffeine
- Maintain a consistent body position (lying down or sitting)
- Use a reliable measurement device (chest strap or optical sensor)

### Factors That Can Lower HRV
- Poor sleep quality
- High stress levels
- Overtraining / insufficient recovery
- Alcohol consumption
- Illness or infection
- Dehydration
- Poor nutrition

### Factors That Can Improve HRV
- Regular aerobic exercise
- Quality sleep (7-9 hours)
- Stress management (meditation, breathing exercises)
- Proper hydration
- Balanced nutrition
- Adequate recovery between workouts

---

## References

1. HealthEncyclo. (2024). *HRV by Age Chart - Heart Rate Variability Reference Table*. https://www.healthencyclo.com/en/calculator/hrv-by-age-chart

2. Shaffer, F., & Ginsberg, J. P. (2017). An Overview of Heart Rate Variability Metrics and Norms. *Frontiers in Public Health*, 5, 258.

3. Electrophysiology, Task Force of the European Society of Cardiology the North American Society of Pacing. (1996). Heart Rate Variability: Standards of Measurement, Physiological Interpretation, and Clinical Use. *Circulation*, 93(5), 1043-1065.
