# Resting Heart Rate (RHR) Evaluation

This document describes the algorithms used to evaluate Resting Heart Rate status and calculate health scores in the `resting-heart-rate.nools` rules engine.

## What is Resting Heart Rate?

Resting Heart Rate (RHR) is the number of times your heart beats per minute while at rest. It is a key indicator of cardiovascular fitness and overall health.

- **Lower RHR** generally indicates better cardiovascular fitness, as the heart is more efficient at pumping blood
- **Higher RHR** may indicate poor fitness, stress, dehydration, or underlying health conditions
- **Normal range** for adults is typically 60-100 beats per minute (bpm)
- **Athletes** often have RHR as low as 40-50 bpm due to improved cardiac efficiency

---

## Table 1. Resting Heart Rate (RHR) Values for Men (beats per minute)

| Age | Athlete | Excellent | Good | Above Average | Average | Below Average | Poor |
|-----|---------|-----------|------|---------------|---------|---------------|------|
| **18-25** | 49-55 | 56-61 | 62-65 | 66-69 | 70-73 | 74-81 | 82+ |
| **26-35** | 49-54 | 55-61 | 62-65 | 66-70 | 71-74 | 75-81 | 82+ |
| **36-45** | 50-56 | 57-62 | 63-66 | 67-70 | 71-75 | 76-82 | 83+ |
| **46-55** | 50-57 | 58-63 | 64-67 | 68-71 | 72-76 | 77-83 | 84+ |
| **56-65** | 51-56 | 57-61 | 62-67 | 68-71 | 72-75 | 76-81 | 82+ |
| **65+** | 50-55 | 56-61 | 62-65 | 66-69 | 70-73 | 74-79 | 80+ |

---

## Table 2. Resting Heart Rate (RHR) Values for Women (beats per minute)

| Age | Athlete | Excellent | Good | Above Average | Average | Below Average | Poor |
|-----|---------|-----------|------|---------------|---------|---------------|------|
| **18-25** | 54-60 | 61-65 | 66-69 | 70-73 | 74-78 | 79-84 | 85+ |
| **26-35** | 54-59 | 60-64 | 65-68 | 69-72 | 73-76 | 77-82 | 83+ |
| **36-45** | 54-59 | 60-64 | 65-69 | 70-73 | 74-78 | 79-84 | 85+ |
| **46-55** | 54-60 | 61-65 | 66-69 | 70-73 | 74-77 | 78-83 | 84+ |
| **56-65** | 54-59 | 60-64 | 65-68 | 69-73 | 74-77 | 78-83 | 84+ |
| **65+** | 54-59 | 60-64 | 65-68 | 69-72 | 73-76 | 77-84 | 84+ |

*Source: [MedicineNet - What Is a Good Resting Heart Rate by Age?](https://www.medicinenet.com/what_is_a_good_resting_heart_rate_by_age/article.htm), [TopEndSports - Resting Heart Rate Chart](https://www.topendsports.com/testing/heart-rate-resting-chart.htm)*

---

## Bradycardia and Tachycardia

### Bradycardia (Slow Heart Rate)

Bradycardia is defined as a resting heart rate below 60 bpm. While this can be normal for well-trained athletes, it may indicate a problem if accompanied by symptoms.

**Symptoms of concerning bradycardia:**
- Dizziness or lightheadedness
- Fatigue or weakness
- Shortness of breath
- Fainting or near-fainting
- Confusion or memory problems
- Chest pain

### Tachycardia (Fast Heart Rate)

Tachycardia is defined as a resting heart rate above 100 bpm. This may indicate stress, anxiety, dehydration, or underlying cardiac conditions.

**Symptoms of concerning tachycardia:**
- Heart palpitations
- Rapid pulse
- Chest pain or discomfort
- Shortness of breath
- Dizziness
- Fainting

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(rhr, age, sex, hasBradycardiaSymptoms, hasTachycardiaSymptoms)` function returns one of nine status values:

| Status | Description |
|--------|-------------|
| `athlete` | RHR is in the athlete range for age/sex |
| `excellent` | RHR is in the excellent range for age/sex |
| `good` | RHR is in the good range for age/sex |
| `above.average` | RHR is above average for age/sex |
| `average` | RHR is average for age/sex |
| `below.average` | RHR is below average for age/sex |
| `poor` | RHR is in the poor range for age/sex |
| `bradycardia` | RHR < 60 AND has bradycardia symptoms |
| `tachycardia` | RHR > 100 AND has tachycardia symptoms |

### Algorithm

```
1. If age < 18 → return null (not supported)
2. If RHR > 100 AND hasTachycardiaSymptoms → return "tachycardia"
3. If RHR < 60 AND hasBradycardiaSymptoms → return "bradycardia"
4. Get age/sex-specific thresholds
5. Compare RHR against thresholds (lower is better):
   - If RHR ≤ athleteMax → "athlete"
   - If RHR ≤ excellentMax → "excellent"
   - If RHR ≤ goodMax → "good"
   - If RHR ≤ aboveAvgMax → "above.average"
   - If RHR ≤ avgMax → "average"
   - If RHR ≤ belowAvgMax → "below.average"
   - Otherwise → "poor"
```

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(rhr, age, sex, hasBradycardiaSymptoms, hasTachycardiaSymptoms)` function returns a score from **0** (worst) to **1000** (best/optimal).

### Score Ranges by Status

```
Score Distribution by RHR Status (lower RHR = higher score)

1000 ┤ ████████████████████████████████ Elite Athlete (RHR ≤ 40)
     │
 900 ┤ ████████████████████████████ Athlete threshold
     │
 800 ┤ ████████████████████████ Excellent
     │
 650 ┤ ██████████████████ Good
     │
 500 ┤ ████████████████ Above Average
     │
 350 ┤ ██████████████ Average
     │
 200 ┤ ████████████ Below Average
     │
   0 ┼────────────────────────────────────────────────
         Athlete  Excel  Good  AbvAvg  Avg  BlwAvg  Poor
```

| Status | Score Range |
|--------|-------------|
| **Athlete** | 900-1000 |
| **Excellent** | 800-899 |
| **Good** | 650-799 |
| **Above Average** | 500-649 |
| **Average** | 350-499 |
| **Below Average** | 200-349 |
| **Poor** | 0-199 |
| **Bradycardia** | 0-100 (medical concern) |
| **Tachycardia** | 0-100 (medical concern) |

### Scoring Formulas

#### Athlete (900-1000)
Score increases as RHR decreases toward elite athlete levels (40 bpm).
```
if RHR ≤ 40:
    score = 1000
else:
    range = athleteMax - 40
    progress = (athleteMax - RHR) / range
    score = 900 + (progress × 100)
```

#### Excellent (800-899)
```
range = excellentMax - athleteMax
progress = (excellentMax - RHR) / range
score = 800 + (progress × 99)
```

#### Good (650-799)
```
range = goodMax - excellentMax
progress = (goodMax - RHR) / range
score = 650 + (progress × 149)
```

#### Above Average (500-649)
```
range = aboveAvgMax - goodMax
progress = (aboveAvgMax - RHR) / range
score = 500 + (progress × 149)
```

#### Average (350-499)
```
range = avgMax - aboveAvgMax
progress = (avgMax - RHR) / range
score = 350 + (progress × 149)
```

#### Below Average (200-349)
```
range = belowAvgMax - avgMax
progress = (belowAvgMax - RHR) / range
score = 200 + (progress × 149)
```

#### Poor (0-199)
Score decreases as RHR increases beyond belowAvgMax, capping at RHR = 120.
```
if RHR ≥ 120:
    score = 0
else:
    range = 120 - belowAvgMax
    progress = (120 - RHR) / range
    score = progress × 199
```

#### Bradycardia (0-100)
Score decreases as RHR decreases below 60, with 0 at RHR ≤ 30.
```
deficit = 60 - RHR
progress = min(deficit / 30, 1)
score = 100 × (1 - progress)
```

#### Tachycardia (0-100)
Score decreases as RHR increases above 100, with 0 at RHR ≥ 150.
```
excess = RHR - 100
progress = min(excess / 50, 1)
score = 100 × (1 - progress)
```

---

## Example Calculations

### Example 1: 25-year-old Male with RHR of 58bpm
- **Thresholds for Men 18-25:** [55, 61, 65, 69, 73, 81]
- **RHR 58bpm** falls in "Excellent" range (56-61)
- **Progress:** (61 - 58) / (61 - 55) = 3/6 = 0.5
- **Score:** 800 + (0.5 × 99) = 800 + 50 = **850**
- **Status:** `"excellent"`

### Example 2: 45-year-old Female with RHR of 72bpm
- **Thresholds for Women 36-45:** [59, 64, 69, 73, 78, 84]
- **RHR 72bpm** falls in "Above Average" range (70-73)
- **Progress:** (73 - 72) / (73 - 69) = 1/4 = 0.25
- **Score:** 500 + (0.25 × 149) = 500 + 37 = **537**
- **Status:** `"above.average"`

### Example 3: 30-year-old Male Athlete with RHR of 48bpm
- **Thresholds for Men 26-35:** [54, 61, 65, 70, 74, 81]
- **RHR 48bpm** falls in "Athlete" range (≤54)
- **Progress:** (54 - 48) / (54 - 40) = 6/14 = 0.43
- **Score:** 900 + (0.43 × 100) = 900 + 43 = **943**
- **Status:** `"athlete"`

### Example 4: 55-year-old Male with RHR of 52bpm and Bradycardia Symptoms
- **RHR 52bpm** < 60 AND has symptoms → Bradycardia
- **Deficit:** 60 - 52 = 8
- **Progress:** 8 / 30 = 0.27
- **Score:** 100 × (1 - 0.27) = 100 × 0.73 = **73**
- **Status:** `"bradycardia"`

---

## Factors Affecting Resting Heart Rate

### Measurement Best Practices
- Measure first thing in the morning before getting out of bed
- Sit or lie down for at least 5 minutes before measuring
- Avoid caffeine, alcohol, or exercise before measurement
- Measure at the same time daily for consistency
- Take multiple readings and average them

### Factors That Can Lower RHR
- Regular aerobic exercise
- Improved cardiovascular fitness
- Adequate sleep and recovery
- Relaxation techniques (meditation, deep breathing)
- Certain medications (beta-blockers)

### Factors That Can Raise RHR
- Physical deconditioning
- Stress and anxiety
- Dehydration
- Caffeine consumption
- Illness or infection
- Certain medications (stimulants, decongestants)
- Heat or humidity
- Smoking
- Poor sleep

---

## Clinical Significance

### When to See a Doctor

**Seek immediate medical attention if you experience:**
- Resting heart rate consistently above 100 bpm with symptoms
- Resting heart rate consistently below 60 bpm with symptoms (if not an athlete)
- Sudden changes in resting heart rate
- Irregular heartbeat
- Chest pain or pressure
- Shortness of breath at rest
- Fainting or near-fainting episodes

### Research Findings

Studies have shown that:
- A resting heart rate of 80-90 bpm is associated with a 40% shorter lifespan compared to 60-69 bpm
- Each increase of 10 bpm in resting heart rate is associated with increased cardiovascular mortality
- Lower resting heart rate is associated with better longevity outcomes

---

## Age Considerations

**Note:** This evaluation system is designed for adults aged 18 and older. Children and adolescents have different normal ranges and should not be evaluated using these thresholds.

---

## References

1. MedicineNet. (2024). *What Is a Good Resting Heart Rate? Chart by Age and Gender*. https://www.medicinenet.com/what_is_a_good_resting_heart_rate_by_age/article.htm

2. TopEndSports. (2024). *Resting Heart Rate Chart*. https://www.topendsports.com/testing/heart-rate-resting-chart.htm

3. American Heart Association. (2024). *All About Heart Rate (Pulse)*. https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse

4. Mayo Clinic. (2024). *Heart rate: What's normal?*. https://www.mayoclinic.org/healthy-lifestyle/fitness/expert-answers/heart-rate/faq-20057979

5. Cleveland Clinic. (2024). *Resting Heart Rate*. https://my.clevelandclinic.org/health/diagnostics/17402-pulse--heart-rate
