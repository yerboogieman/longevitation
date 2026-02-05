# Blood Oxygen Saturation (SpO2) Evaluation

This document describes the algorithms used to evaluate Blood Oxygen Saturation (SpO2) status and calculate health scores in the `spo2.nools` rules engine.

## What is SpO2?

SpO2 (peripheral capillary oxygen saturation) is a measure of the amount of oxygen-carrying hemoglobin in the blood relative to the amount of hemoglobin not carrying oxygen. It is typically measured using a pulse oximeter.

- **Normal SpO2** is typically 95-100% for healthy individuals at sea level
- **Lower SpO2** indicates that the body may not be getting enough oxygen
- **SpO2 below 90%** is generally considered low and may require medical attention
- **SpO2 below 80%** can lead to organ damage and is a medical emergency

---

## SpO2 Levels and Health Status

| SpO2 Range | Status | Description |
|------------|--------|-------------|
| **95-100%** | Normal | Normal blood oxygen levels |
| **91-94%** | Concerning | Mildly low oxygen levels; may indicate respiratory issues |
| **86-90%** | Low | Low blood oxygen levels; supplemental oxygen may be needed |
| **80-85%** | Possible Brain Effects | Severe hypoxemia; oxygen deprivation may affect brain function |
| **<80%** | Cyanosis | Critical hypoxemia; medical emergency |

*Source: [eMedicineHealth - Low & Normal Blood Oxygen Levels](https://www.emedicinehealth.com/low_normal_blood_oxygen_levels_pulse_oximeter/article_em.htm)*

---

## Status Evaluation Algorithm (`evaluateStatus`)

The `evaluateStatus(spo2)` function returns one of five status values:

| Status | Description |
|--------|-------------|
| `normal` | SpO2 >= 95% |
| `concerning` | SpO2 91-94% |
| `low` | SpO2 86-90% |
| `possible.brain.effects` | SpO2 80-85% |
| `cyanosis` | SpO2 < 80% |

### Algorithm

```
1. If SpO2 >= 95% → return "normal"
2. If SpO2 >= 91% → return "concerning"
3. If SpO2 >= 86% → return "low"
4. If SpO2 >= 80% → return "possible.brain.effects"
5. Otherwise → return "cyanosis"
```

---

## Score Calculation Algorithm (`evaluateScore`)

The `evaluateScore(spo2)` function returns a score from **0** (worst) to **1000** (best/optimal).

### Score Ranges by Status

```
Score Distribution by SpO2 Status (higher SpO2 = higher score)

1000 ┤ ████████████████████████████████ Perfect (100%)
     │
 900 ┤ ████████████████████████████ Normal threshold (95%)
     │
 600 ┤ ██████████████████████ Concerning (91-94%)
     │
 300 ┤ ██████████████ Low (86-90%)
     │
 100 ┤ ████████ Brain Effects (80-85%)
     │
   0 ┼────────────────────────────────────────────────
         100%  95%  91%  86%  80%  67%  SpO2
```

| Status | Score Range |
|--------|-------------|
| **Normal** (95-100%) | 900-1000 |
| **Concerning** (91-94%) | 600-899 |
| **Low** (86-90%) | 300-599 |
| **Possible Brain Effects** (80-85%) | 100-299 |
| **Cyanosis** (<80%) | 0-99 |

### Scoring Formulas

#### Normal (900-1000)
Score increases linearly from 900 at 95% to 1000 at 100%.
```
if SpO2 >= 100:
    score = 1000
else:
    range = 100 - 95  // 5
    progress = (SpO2 - 95) / range
    score = 900 + (progress × 100)
```

#### Concerning (600-899)
Score increases linearly from 600 at 91% to 899 at 94%.
```
range = 94 - 91  // 3
progress = (SpO2 - 91) / range
score = 600 + (progress × 299)
```

#### Low (300-599)
Score increases linearly from 300 at 86% to 599 at 90%.
```
range = 90 - 86  // 4
progress = (SpO2 - 86) / range
score = 300 + (progress × 299)
```

#### Possible Brain Effects (100-299)
Score increases linearly from 100 at 80% to 299 at 85%.
```
range = 85 - 80  // 5
progress = (SpO2 - 80) / range
score = 100 + (progress × 199)
```

#### Cyanosis (0-99)
Score increases linearly from 0 at 67% or below to 99 at 79%.
```
if SpO2 <= 67:
    score = 0
else:
    range = 79 - 67  // 12
    progress = (SpO2 - 67) / range
    score = progress × 99
```

---

## Example Calculations

### Example 1: Healthy Person at Rest (SpO2 98%)
- **Status:** 98% >= 95% → `"normal"`
- **Score:**
  - progress = (98 - 95) / 5 = 0.6
  - score = 900 + (0.6 × 100) = **960**

### Example 2: Person at High Altitude (SpO2 93%)
- **Status:** 91% <= 93% < 95% → `"concerning"`
- **Score:**
  - progress = (93 - 91) / 3 = 0.67
  - score = 600 + (0.67 × 299) = **800**

### Example 3: Person Needing Supplemental Oxygen (SpO2 88%)
- **Status:** 86% <= 88% < 91% → `"low"`
- **Score:**
  - progress = (88 - 86) / 4 = 0.5
  - score = 300 + (0.5 × 299) = **450**

### Example 4: Severe Hypoxemia (SpO2 82%)
- **Status:** 80% <= 82% < 86% → `"possible.brain.effects"`
- **Score:**
  - progress = (82 - 80) / 5 = 0.4
  - score = 100 + (0.4 × 199) = **180**

### Example 5: Critical Emergency (SpO2 70%)
- **Status:** 70% < 80% → `"cyanosis"`
- **Score:**
  - progress = (70 - 67) / 12 = 0.25
  - score = 0.25 × 99 = **25**

---

## Factors Affecting SpO2 Readings

### Conditions That May Lower SpO2
- **Respiratory conditions:** COPD, asthma, pneumonia, COVID-19
- **Cardiac conditions:** Heart failure, congenital heart defects
- **High altitude:** Lower oxygen pressure reduces saturation
- **Sleep apnea:** Oxygen drops during breathing pauses
- **Anemia:** Reduced hemoglobin capacity
- **Smoke inhalation:** Carbon monoxide binds to hemoglobin

### Factors That May Affect Measurement Accuracy
- Cold extremities (poor circulation)
- Nail polish or artificial nails
- Skin pigmentation
- Movement during measurement
- Poor sensor placement
- Bright ambient light

### Best Practices for Measurement
- Ensure warm, well-perfused fingers
- Remove nail polish from measurement finger
- Keep still during measurement
- Allow sensor to stabilize for several seconds
- Use multiple readings and average if uncertain
- Measure at rest, not immediately after activity

---

## Clinical Significance

### When to Seek Medical Attention

| SpO2 Level | Action |
|------------|--------|
| **95-100%** | Normal; no action needed |
| **91-94%** | Monitor closely; consult doctor if persistent |
| **86-90%** | Seek medical evaluation; may need supplemental oxygen |
| **80-85%** | Urgent medical attention required |
| **<80%** | **Medical emergency** - call emergency services immediately |

### Symptoms of Low Blood Oxygen (Hypoxemia)
- Shortness of breath
- Rapid breathing
- Rapid heart rate
- Confusion or disorientation
- Headache
- Blue tint to skin, lips, or fingernails (cyanosis)
- Dizziness or fainting
- Restlessness or anxiety

### Chronic vs Acute Hypoxemia
- **Chronic:** Some individuals with lung disease may have chronically lower SpO2 levels and may tolerate levels that would be concerning in healthy individuals
- **Acute:** A sudden drop in SpO2 is more concerning than chronically low levels and requires immediate evaluation

---

## Special Populations

### High Altitude
- At elevations above 8,000 feet (2,400 meters), lower SpO2 values are expected
- Acclimatized individuals may have SpO2 of 88-92% and be asymptomatic
- Acute mountain sickness risk increases when SpO2 drops below 90%

### Athletes
- Athletes generally maintain normal SpO2 at rest
- During intense exercise, SpO2 may temporarily decrease
- Post-exercise SpO2 should return to normal within minutes

### Older Adults
- SpO2 may naturally be slightly lower in elderly individuals
- Values of 94-95% may be acceptable in older adults with no symptoms

### Infants and Children
- Normal SpO2 ranges may differ for neonates and young children
- Consult pediatric guidelines for age-appropriate thresholds

---

## Limitations of Pulse Oximetry

Pulse oximeters measure oxygen saturation but do not detect:
- Carbon monoxide poisoning (SpO2 may read falsely high)
- Methemoglobinemia
- Low blood oxygen content due to anemia
- Tissue oxygen delivery problems

**Note:** SpO2 is one vital sign among many. Clinical decisions should incorporate multiple factors including patient symptoms, history, and other vital signs.

---

## References

1. eMedicineHealth. (2024). *Low & Normal Blood Oxygen Levels: How to Improve It*. https://www.emedicinehealth.com/low_normal_blood_oxygen_levels_pulse_oximeter/article_em.htm

2. American Lung Association. (2024). *Pulse Oximetry*. https://www.lung.org/lung-health-diseases/lung-procedures-and-tests/pulse-oximetry

3. Mayo Clinic. (2024). *Hypoxemia (low blood oxygen)*. https://www.mayoclinic.org/symptoms/hypoxemia/basics/definition/sym-20050930

4. Cleveland Clinic. (2024). *Pulse Oximetry*. https://my.clevelandclinic.org/health/diagnostics/22447-pulse-oximetry

5. World Health Organization. (2024). *Pulse Oximetry Training Manual*. https://www.who.int/patientsafety/safesurgery/pulse_oximetry/en/
