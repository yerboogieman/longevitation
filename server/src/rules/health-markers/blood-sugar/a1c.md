# A1C and Estimated Average Glucose Levels

> Source: [Cleveland Clinic](https://my.clevelandclinic.org/) - A1C and Estimated Average Glucose Levels Chart

## A1C Ranges

| Status | A1C Percentage | EAG (mg/dL) | EAG (mmol/L) |
|--------|----------------|-------------|--------------|
| Ideal | < 5.5% | < 111 | < 6.2 |
| In-range | 5.5% - 5.69% | 111 - 117 | 6.2 - 6.5 |
| Prediabetes | 5.7% - 6.4% | 117 - 137 | 6.5 - 7.6 |
| Diabetes | > 6.4% | > 137 | > 7.6 |

## Scoring Algorithm

The A1C score uses linear interpolation within each health category range, producing a score from 1000 (perfect) to 0 (worst).

### Score Ranges by Category

| Category | A1C Range | Score Range | Description |
|----------|-----------|-------------|-------------|
| Ideal | 0% - 5.5% | 1000 - 850 | Optimal blood sugar control |
| In-range | 5.5% - 5.7% | 849 - 750 | Normal, but worth monitoring |
| Pre-diabetes | 5.7% - 6.4% | 749 - 650 | Elevated risk, intervention recommended |
| Diabetes | > 6.4% | 649 - 0 | Diabetic range, score reaches 0 at 14% |

### Formulas

**Ideal (< 5.5%):**
```
score = 1000 - (percentage × 150 / 5.5)
```

**In-range (5.5% - 5.7%):**
```
score = 849 - ((percentage - 5.5) × 99 / 0.2)
```

**Pre-diabetes (5.7% - 6.4%):**
```
score = 749 - ((percentage - 5.7) × 99 / 0.7)
```

**Diabetes (> 6.4%):**
```
score = max(0, 649 - ((percentage - 6.4) × 649 / 7.6))
```

### Example Scores

| A1C % | Score | Status |
|-------|-------|--------|
| 0.0 | 1000 | Ideal |
| 4.5 | 877 | Ideal |
| 5.0 | 864 | Ideal |
| 5.5 | 849 | In-range |
| 5.6 | 800 | In-range |
| 5.7 | 749 | Pre-diabetes |
| 6.0 | 707 | Pre-diabetes |
| 6.4 | 650 | Pre-diabetes |
| 6.5 | 640 | Diabetes |
| 7.0 | 598 | Diabetes |
| 8.0 | 512 | Diabetes |
| 10.0 | 342 | Diabetes |
| 14.0 | 0 | Diabetes |

## Diabetes: Increased Risk of Complications

| A1C Percentage | EAG (mg/dL) | EAG (mmol/L) |
|----------------|-------------|--------------|
| 6.5% | 140 | 7.8 |
| 7.0% | 154 | 8.6 |
| 7.5% | 169 | 9.4 |
| 8.0% | 183 | 10.1 |
| 8.5% | 197 | 10.9 |
| 9.0% | 212 | 11.8 |
| 9.5% | 226 | 12.6 |
| 10.0% | 240 | 13.4 |
