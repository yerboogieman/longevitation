# Blood Pressure Evaluation

This document describes the algorithms used to evaluate blood pressure status and calculate health scores in the `blood-pressure.nools` rules engine.

## Blood Pressure Categories Chart

The following chart shows the American Heart Association blood pressure categories:

![Blood Pressure Categories](https://www.heart.org/-/media/Images/Health-Topics/High-Blood-Pressure/blood-pressure-readings-chart-English.png)

*Source: [American Heart Association - Understanding Blood Pressure Readings](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings)*

### Blood Pressure Categories Table

| Category | Systolic (mm Hg) | | Diastolic (mm Hg) |
|----------|------------------|---|-------------------|
| **Hypotension** | Less than 90 | and | Less than 60 |
| **Normal** | Less than 120 | and | Less than 80 |
| **Elevated** | 120-129 | and | Less than 80 |
| **Stage 1 Hypertension** | 130-139 | or | 80-89 |
| **Stage 2 Hypertension** | 140-180 | or | 90-120 |
| **Severe Hypertension** | Higher than 180 | or | Higher than 120 |
| **Hypertensive Crisis** | Higher than 180 + symptoms | or | Higher than 120 + symptoms |

## Low Blood Pressure (Hypotension) Chart

Low blood pressure is generally defined as systolic less than 90 mm Hg **and** diastolic less than 60 mm Hg.

```
                    Hypotension Thresholds
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │   SYSTOLIC < 90 mm Hg                          │
    │        AND                                      │
    │   DIASTOLIC < 60 mm Hg                         │
    │                                                 │
    │   ┌─────────────────────────────────────────┐  │
    │   │  May be normal for some individuals     │  │
    │   │  Concerning if accompanied by symptoms  │  │
    │   └─────────────────────────────────────────┘  │
    │                                                 │
    └─────────────────────────────────────────────────┘
```

*Source: [American Heart Association - Low Blood Pressure](https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/low-blood-pressure-when-blood-pressure-is-too-low)*

---

## Status Evaluation Algorithms

### Systolic Status (`evaluateSystolicStatus`)

Evaluates the systolic (upper) blood pressure reading independently.

| Systolic Range | Status |
|----------------|--------|
| < 90 mm Hg | `low` |
| 90-119 mm Hg | `normal` |
| 120-129 mm Hg | `elevated` |
| 130-139 mm Hg | `stage1.hypertension` |
| 140-180 mm Hg | `stage2.hypertension` |
| > 180 mm Hg | `severe.hypertension` |

### Diastolic Status (`evaluateDiastolicStatus`)

Evaluates the diastolic (lower) blood pressure reading independently.

| Diastolic Range | Status |
|-----------------|--------|
| < 60 mm Hg | `low` |
| 60-79 mm Hg | `normal` |
| 80-89 mm Hg | `stage1.hypertension` |
| 90-120 mm Hg | `stage2.hypertension` |
| > 120 mm Hg | `severe.hypertension` |

### Combined Blood Pressure Status (`evaluateBloodPressureStatus`)

Evaluates the overall blood pressure status using both systolic and diastolic readings together.

| Condition | Status |
|-----------|--------|
| Systolic < 90 **AND** Diastolic < 60 | `hypotension` |
| Systolic < 120 **AND** Diastolic < 80 | `normal` |
| Systolic 120-129 **AND** Diastolic < 80 | `elevated` |
| Systolic 130-139 **OR** Diastolic 80-89 | `stage1.hypertension` |
| Systolic 140-180 **OR** Diastolic 90-120 | `stage2.hypertension` |
| Systolic > 180 **OR** Diastolic > 120 (without symptoms) | `severe.hypertension` |
| Systolic > 180 **OR** Diastolic > 120 (with symptoms) | `hypertensive.crisis` |

**Note:** For hypertension categories, the higher category applies when systolic and diastolic readings fall into different categories.

---

## Score Calculation Algorithm (`calculateBloodPressureScore`)

The blood pressure score ranges from **0** (worst) to **1000** (perfect/optimal).

### Score Ranges by Category

```
Score Distribution by Blood Pressure Category

1000 ┤ ████████████████████████████████ Optimal (105/70)
     │
 900 ┤ ████████████████████████ Normal range
     │
 850 ┤ ████████████████████ Normal boundaries / Low BP without symptoms
     │
 750 ┤ ████████████████ Elevated
     │
 680 ┤ ██████████████ Stage 1 Hypertension
     │
 400 ┤ ████████ Stage 2 Hypertension
     │
 250 ┤ ████ Hypertensive Crisis (with symptoms)
     │
   0 ┼────────────────────────────────────────────────
         Low  Normal  Elev  S1   S2   Severe  Crisis
```

### Detailed Scoring Logic

#### 1. Hypotension (Systolic < 90 AND Diastolic < 60)

Low blood pressure is not necessarily dangerous unless accompanied by symptoms.

- **Without symptoms:** Score starts at 900 at upper bound (89/59), decreases toward 0 as values drop
- **With symptoms:** Score starts at 600 at upper bound, decreases toward 0

**Formula:**
```
combinedRatio = (systolic/90 × 0.6) + (diastolic/60 × 0.4)
score = maxScore × combinedRatio

where maxScore = 600 (with symptoms) or 900 (without symptoms)
```

#### 2. Normal Lower-Optimal (90-105 Systolic AND 60-70 Diastolic)

Score increases from 899 to 1000 as values approach the optimal range.

**Formula:**
```
systolicProgress = (systolic - 90) / 15
diastolicProgress = (diastolic - 60) / 10
avgProgress = (systolicProgress + diastolicProgress) / 2
score = 899 + (avgProgress × 101)
```

#### 3. Normal Upper-Optimal (105-120 Systolic AND 70-80 Diastolic)

Score starts at 1000 (optimal at 105/70) and decreases to 900 at boundary.

**Formula:**
```
systolicProgress = (systolic - 105) / 15
diastolicProgress = (diastolic - 70) / 10
avgProgress = (systolicProgress + diastolicProgress) / 2
score = 1000 - (avgProgress × 100)
```

#### 4. Elevated (120-129 Systolic AND Diastolic < 80)

Score ranges from 899 to 750.

**Formula:**
```
systolicProgress = (systolic - 120) / 9
score = 899 - (systolicProgress × 149)
```

#### 5. Stage 1 Hypertension (130-139 Systolic OR 80-89 Diastolic)

Score ranges from 749 to 680.

**Formula:**
```
systolicProgress = (systolic - 130) / 9    (if systolic >= 130)
diastolicProgress = (diastolic - 80) / 9   (if diastolic >= 80)
maxProgress = max(systolicProgress, diastolicProgress)
score = 749 - (maxProgress × 69)
```

#### 6. Stage 2 Hypertension (140-180 Systolic OR 90-120 Diastolic)

Score ranges from 679 to 400.

**Formula:**
```
systolicProgress = (systolic - 140) / 40   (if systolic >= 140)
diastolicProgress = (diastolic - 90) / 30  (if diastolic >= 90)
maxProgress = max(systolicProgress, diastolicProgress)
score = 679 - (maxProgress × 279)
```

#### 7. Severe Hypertension / Hypertensive Crisis (Systolic > 180 OR Diastolic > 120)

Score ranges from 399/250 to 0.

**Formula:**
```
systolicExcess = (systolic - 180) / 40     (if systolic > 180)
diastolicExcess = (diastolic - 120) / 30   (if diastolic > 120)
maxExcess = max(systolicExcess, diastolicExcess)
score = maxScore × (1 - min(maxExcess, 1))

where maxScore = 250 (with symptoms) or 399 (without symptoms)
```

---

## Symptoms of Critically High Blood Pressure (Hypertensive Crisis)

A hypertensive crisis occurs when blood pressure rises rapidly to dangerously high levels (higher than 180/120 mm Hg). **Call 911 immediately** if you experience any of these symptoms with severely elevated blood pressure:

### Emergency Symptoms
- **Chest pain** - may indicate heart attack or aortic dissection
- **Shortness of breath** - may indicate pulmonary edema or heart failure
- **Back pain** - severe, sudden back pain may indicate aortic dissection
- **Numbness or weakness** - especially on one side of the body, may indicate stroke
- **Change in vision** - blurred vision, vision loss, or seeing spots
- **Difficulty speaking** - slurred speech or inability to speak clearly
- **Severe headache** - unlike any headache experienced before
- **Nausea or vomiting**
- **Confusion or altered mental status**
- **Seizures**

### Potential Complications
- Stroke
- Heart attack
- Aortic dissection
- Acute kidney failure
- Pulmonary edema (fluid in lungs)
- Eclampsia (in pregnant women)
- Loss of consciousness
- Permanent organ damage

*Sources: [American Heart Association - When to Call 911](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/when-to-call-911-for-high-blood-pressure), [Cleveland Clinic - Hypertensive Crisis](https://my.clevelandclinic.org/health/diseases/24470-hypertensive-crisis)*

---

## Symptoms of Critically Low Blood Pressure (Severe Hypotension)

While low blood pressure is often not a concern, severely low blood pressure can be dangerous when it prevents vital organs from receiving adequate blood flow. Seek medical attention if you experience:

### Warning Symptoms
- **Dizziness or lightheadedness** - most common symptom
- **Fainting (syncope)** - loss of consciousness
- **Blurred or fading vision**
- **Nausea**
- **Fatigue** - unusual tiredness or weakness
- **Lack of concentration** - difficulty thinking clearly
- **Cold, clammy, pale skin**
- **Rapid, shallow breathing**
- **Weak, rapid pulse**
- **Confusion** - especially in older adults
- **Dehydration and unusual thirst**

### When Hypotension is Dangerous
- When standing causes persistent dizziness (orthostatic hypotension)
- After eating large meals (postprandial hypotension)
- Following prolonged bed rest
- Due to severe infection (septic shock)
- Due to severe blood loss
- Due to severe allergic reaction (anaphylaxis)
- Due to heart problems

### Seek Emergency Care If
- Blood pressure drops suddenly
- Accompanied by chest pain
- Accompanied by shortness of breath
- Signs of shock (confusion, cold skin, rapid breathing)

*Sources: [American Heart Association - Low Blood Pressure](https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/low-blood-pressure-when-blood-pressure-is-too-low), [Mayo Clinic - Low Blood Pressure](https://www.mayoclinic.org/diseases-conditions/low-blood-pressure/symptoms-causes/syc-20355465)*

---

## References

1. American Heart Association. (2024). *Understanding Blood Pressure Readings*. https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings

2. American Heart Association. (2024). *Low Blood Pressure - When Blood Pressure Is Too Low*. https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/low-blood-pressure-when-blood-pressure-is-too-low

3. American Heart Association. (2024). *When to Call 911 for High Blood Pressure*. https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/when-to-call-911-for-high-blood-pressure

4. Mayo Clinic. (2024). *Low blood pressure (hypotension) - Symptoms and causes*. https://www.mayoclinic.org/diseases-conditions/low-blood-pressure/symptoms-causes/syc-20355465

5. Cleveland Clinic. (2024). *Hypertensive Crisis: Types, Causes & Symptoms*. https://my.clevelandclinic.org/health/diseases/24470-hypertensive-crisis

6. American Heart Association/American College of Cardiology. (2017). *2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults*. Hypertension, 71(6), e13-e115.
