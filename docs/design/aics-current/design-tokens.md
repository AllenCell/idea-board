# Allen Institute — Design Tokens

Source: Allen Institute Brand Cheat Sheet (2025).

## Colors

### Base (neutrals — backgrounds and structure)

```css
:root {
  --BLACK: #000000;          /* Pantone Black, CMYK 20/20/20/100 */
  --WHITE: #FFFFFF;          /* CMYK 0/0/0/0 */
  --PAGE_1: #F3F0E8;         /* Pantone Cool Gray 1C — warm off-white, light page bg */
  --PAGE_2: #DED9D1;         /* Pantone Warm Gray 1C — warm light gray */
  --GRAY_1: #AAA39F;         /* Pantone Warm Gray 6C — medium warm gray */
  --GRAY_2: #737373;         /* Pantone 4287C — mid gray */
}
```

### Primary (main brand colors — used as backgrounds)

```css
:root {
  --ALLEN_BLUE: #6464FF;     /* Pantone 213C, CMYK 70/60/0/0 — electric periwinkle */
  --ALLEN_VIOLET: #8246E1;   /* Pantone 266C, CMYK 55/80/0/0 — deep purple */
  --ALLEN_TEAL: #00A59B;     /* Pantone 7710C, CMYK 100/0/40/0 */
  --ALLEN_MAROON: #CD0F55;   /* Pantone 7637C, CMYK 0/100/45/15 — crimson */
}
```

### Accent (highlights — used sparingly for energy and dynamism)

```css
:root {
  --ALLEN_GREEN: #CDEB05;    /* Pantone 389C, CMYK 25/0/100/0 — lime */
  --ALLEN_ROSE: #FF00FF;     /* Pantone 813C, CMYK 0/85/0/0 — magenta */
  --ALLEN_ORANGE: #FF6E00;   /* Pantone 1505C, CMYK 0/70/100/0 */
  --ALLEN_OCHRE: #DC9600;    /* Pantone 6005C, CMYK 0/32/100/14 */
  --ALLEN_YELLOW: #FFEB23;   /* Pantone 102C, CMYK 0/0/100/0 */
}
```

### Semantic tokens

```css
:root {
  --page-bg: var(--PAGE_1);
  --page-bg-alt: var(--PAGE_2);
  --text-primary: var(--BLACK);
  --text-muted: var(--GRAY_2);
  --surface: var(--WHITE);
  --border-color: var(--GRAY_1);
  --primary-color: var(--ALLEN_BLUE);
  --link-color: var(--ALLEN_BLUE);
}
```

## Typography

Custom typeface: **Allen Institute** (licensed — self-host from brand assets).

```css
:root {
  --font-headline: "Allen Institute Headline", sans-serif; /* >24pt, tight tracking */
  --font-text: "Allen Institute Text", sans-serif;         /* <24pt, wide tracking */

  --tracking-headline: -0.03em;   /* tight — headline edition only */
  /* Text edition tracking: never alter — baked into the font */
}
```

| Use case         | Edition  | Size    | Weight    | Notes                          |
|-----------------|----------|---------|-----------|--------------------------------|
| Section label    | Headline | 48px+   | Bold      | e.g., `section/`               |
| Headline         | Headline | 32–48px | Bold      | Tight letter-spacing           |
| Sub-head         | Headline | 24–32px | Semi-bold |                                |
| Body / articulated | Text   | 16px    | Regular   | Do not alter letter-spacing    |
| Italic / numbers | Text     | 16px    | Light Italic |                             |
| Nav / breadcrumb | Text     | 16–20px | Regular   | e.g., `about / people / research` |

## Spacing

```css
:root {
  --content-padding-xl: 32px;   /* > 1280px */
  --content-padding-lg: 20px;   /* 744–1280px */
  --content-padding-sm: 8px;    /* < 744px */
  --content-max-width: 1728px;
}
```

## Breakpoints

```css
/* --breakpoint-lg: 1280px */
/* --breakpoint-sm: 744px  */
```

## Surfaces

| Token          | Value     | Usage                                     |
|----------------|-----------|-------------------------------------------|
| Page bg        | `#F3F0E8` | Primary light background (warm off-white) |
| Page bg alt    | `#DED9D1` | Secondary background, cards               |
| Gray mid       | `#AAA39F` | Borders, dividers                         |
| Gray dark      | `#737373` | Muted text, secondary UI                  |
| Black          | `#000000` | High-contrast text, headlines             |
| Primary bg     | `#6464FF` | Brand section backgrounds                 |

## Ant Design Token Overrides

```typescript
// Approximate mapping — tune to match specific component needs
const theme = {
  token: {
    colorPrimary: "#6464FF",        // ALLEN_BLUE
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#F3F0E8",       // PAGE_1
    colorLink: "#6464FF",
    colorLinkActive: "#8246E1",     // ALLEN_VIOLET
    colorLinkHover: "#8246E1",
    borderRadius: 2,                // brand is geometric, minimal rounding
    colorBorder: "#AAA39F",         // GRAY_1
    fontFamily: '"Allen Institute Text", sans-serif',
  },
  components: {
    Layout: {
      bodyBg: "#F3F0E8",
    },
    Button: {
      colorPrimary: "#6464FF",
      primaryColor: "#FFFFFF",
      defaultColor: "#000000",
      defaultBorderColor: "#000000",
      borderRadius: 2,
    },
    Table: {
      headerColor: "#000000",
      borderColor: "#AAA39F",
      headerBg: "#F3F0E8",
      cellFontSize: 16,
    },
  },
};
```

## Forward Slash Motif (CSS)

```css
/* Use content: "/" in pseudo-elements or include literally in text */
.breadcrumb::after {
  content: "/";
  margin: 0 0.4em;
  font-weight: 300;
}

/* Section labels */
.section-label::after {
  content: "/";
}
```
