# 🧘‍♀️ GirlPilates.com

**The World's #1 Free Bilingual Pilates Resource for Women**

[![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-181717?logo=github)](https://pages.github.com/)
[![Hugo](https://img.shields.io/badge/Built%20with-Hugo-ff4088?logo=hugo)](https://gohugo.io/)
[![Bilingual](https://img.shields.io/badge/Languages-EN%20|%20ES-success)](#)
[![Mobile First](https://img.shields.io/badge/Mobile-100%25-blue)](#)
[![SEO](https://img.shields.io/badge/SEO%2FAEO-Maximum-orange)](#)

> **Free Pilates for Every Woman** | **Pilates Gratis para Todas las Mujeres**

---

## 🎯 Project Overview

A comprehensive, **100% free** Pilates education platform serving 500M+ English and Spanish speakers worldwide. Built as a static site on GitHub Pages for maximum performance, SEO, and zero hosting costs.

### Core Features

| Feature | Description |
|---------|-------------|
| 🏋️ **Exercise Library** | 500+ exercises with video, instructions, modifications |
| 🎯 **Workout Generator** | AI-free client-side routine builder |
| 📋 **Pre-Made Workouts** | 115+ curated workouts by mood, time, goal, equipment |
| 📚 **Encyclopedia** | Complete Pilates education (history, anatomy, methods) |
| 👩‍🏫 **Teacher Directory** | Verified instructor profiles with credentials |
| 🌍 **Fully Bilingual** | Every page in English AND Spanish |
| 📱 **Mobile-First** | 100% touch-optimized, <3s load times |
| 🔍 **Maximum SEO/AEO** | Schema markup on every single page |

---

## 🚀 Why GitHub Pages?

| Benefit | Impact |
|---------|--------|
| **Free hosting** | $0/month forever |
| **Global CDN** | Fastly edge network, <100ms TTFB worldwide |
| **99.9% uptime** | Enterprise reliability |
| **Auto SSL** | HTTPS included (SEO requirement) |
| **No server limits** | Static = infinitely scalable |
| **Perfect Core Web Vitals** | Pre-rendered HTML = fastest possible |

### GitHub Pages Limits (More Than Enough)

| Limit | Value | Our Usage |
|-------|-------|-----------|
| Repository size | 1 GB | ~50 MB (text + config) |
| Bandwidth | 100 GB/month | ~500K pageviews/month |
| Build time | 10 min max | ~30 seconds |
| Sites per account | Unlimited | 1 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      GIRLPILATES.COM                            │
├─────────────────────────────────────────────────────────────────┤
│  Generator    │ Hugo 0.128+ (Extended)                          │
│  Hosting      │ GitHub Pages (free, global CDN)                 │
│  Languages    │ English (default) + Spanish (complete)          │
│  Search       │ Pagefind (client-side, ~50KB)                   │
│  Videos       │ YouTube embeds (lite-youtube-embed)             │
│  CSS          │ Tailwind CSS 3.4+ (purged, ~15KB)               │
│  Analytics    │ Plausible (privacy-first, optional)             │
│  Forms        │ Formspree (free tier: 50 submissions/month)     │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
girlpilates.com/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy on push
│
├── config/
│   └── _default/
│       ├── hugo.toml               # Site config
│       ├── languages.toml          # EN/ES settings
│       ├── menus.en.toml           # English nav
│       ├── menus.es.toml           # Spanish nav
│       └── params.toml             # Global params
│
├── content/
│   ├── en/                         # ═══ ENGLISH ═══
│   │   ├── _index.md               # Homepage
│   │   ├── exercises/
│   │   │   ├── _index.md
│   │   │   └── mat/
│   │   │       ├── _index.md
│   │   │       ├── the-hundred.md
│   │   │       └── ...
│   │   ├── workouts/
│   │   │   ├── _index.md
│   │   │   ├── generator.md
│   │   │   ├── premade/              # 115+ curated workouts
│   │   │   │   ├── _index.md
│   │   │   │   └── [workout].md
│   │   │   └── programs/
│   │   ├── learn/
│   │   │   ├── _index.md
│   │   │   ├── fundamentals/
│   │   │   ├── anatomy/
│   │   │   └── womens-health/
│   │   └── teachers/
│   │
│   └── es/                         # ═══ ESPAÑOL ═══
│       ├── _index.md               # Página principal
│       ├── ejercicios/
│       │   ├── _index.md
│       │   └── mat/
│       │       ├── _index.md
│       │       ├── el-cien.md
│       │       └── ...
│       ├── entrenamientos/
│       │   ├── _index.md
│       │   ├── generador.md
│       │   ├── prefabricados/    # 115+ entrenamientos curados
│       │   │   ├── _index.md
│       │   │   └── [workout].md
│       │   └── programas/
│       ├── aprender/
│       │   ├── _index.md
│       │   ├── fundamentos/
│       │   ├── anatomia/
│       │   └── salud-femenina/
│       └── profesores/
│
├── data/
│   ├── exercises.json              # Exercise database
│   ├── premade_workouts.json       # 115+ curated workouts
│   ├── muscles.json                # Anatomy data
│   └── teachers.json               # Instructor data
│
├── i18n/
│   ├── en.toml                     # English UI (500+ strings)
│   └── es.toml                     # Spanish UI (500+ strings)
│
├── assets/
│   ├── css/
│   │   └── main.css                # Tailwind
│   └── js/
│       ├── app.js                  # Core functionality
│       ├── search.js               # Pagefind init
│       ├── filter.js               # Exercise filtering
│       ├── generator.js            # Workout generator
│       └── lite-yt-embed.js        # Lazy video loading
│
├── layouts/
│   ├── _default/
│   │   ├── baseof.html             # Base + all SEO
│   │   ├── list.html
│   │   └── single.html
│   ├── exercises/
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── head/
│   │   │   ├── seo.html            # Meta tags
│   │   │   ├── schema.html         # JSON-LD
│   │   │   └── hreflang.html       # Language links
│   │   └── components/
│   │       ├── header.html
│   │       ├── footer.html
│   │       ├── nav-mobile.html
│   │       └── exercise-card.html
│   └── shortcodes/
│       ├── youtube.html            # Lazy video
│       └── faq.html                # FAQ + schema
│
├── static/
│   ├── images/
│   ├── fonts/
│   ├── robots.txt
│   └── CNAME                       # Custom domain
│
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🌍 Bilingual Architecture

### Every Page Exists in Both Languages

```
ENGLISH (Default)                    SPANISH
/                                    /es/
/exercises/                          /es/ejercicios/
/exercises/mat/the-hundred/          /es/ejercicios/mat/el-cien/
/workouts/                           /es/entrenamientos/
/workouts/premade/                   /es/entrenamientos/prefabricados/
/workouts/generator/                 /es/entrenamientos/generador/
/learn/                              /es/aprender/
/learn/womens-health/pelvic-floor/   /es/aprender/salud-femenina/suelo-pelvico/
/teachers/                           /es/profesores/
```

### Language Configuration

```toml
# config/_default/languages.toml

[en]
  languageName = "English"
  languageCode = "en"
  weight = 1
  contentDir = "content/en"
  title = "GirlPilates - Free Pilates for Every Woman"
  
  [en.params]
    description = "The world's most comprehensive free Pilates resource. 500+ exercises, expert programs, complete education."
    locale = "en_US"

[es]
  languageName = "Español"
  languageCode = "es"  
  weight = 2
  contentDir = "content/es"
  title = "GirlPilates - Pilates Gratis para Todas las Mujeres"
  
  [es.params]
    description = "El recurso de Pilates gratuito más completo del mundo. Más de 500 ejercicios, programas con expertos, educación completa."
    locale = "es_ES"
```

### Translation Linking

Every content file uses `translationKey` to connect EN↔ES versions:

```yaml
# content/en/exercises/mat/the-hundred.md
---
title: "The Hundred"
translationKey: "exercise-hundred"
---

# content/es/ejercicios/mat/el-cien.md  
---
title: "El Cien"
translationKey: "exercise-hundred"
---
```

### Hreflang (Auto-Generated Every Page)

```html
<!-- layouts/partials/head/hreflang.html -->
<link rel="alternate" hreflang="{{ .Language.Lang }}" href="{{ .Permalink }}" />
{{ range .Translations }}
<link rel="alternate" hreflang="{{ .Language.Lang }}" href="{{ .Permalink }}" />
{{ end }}
<link rel="alternate" hreflang="x-default" href="{{ if eq .Language.Lang "en" }}{{ .Permalink }}{{ else }}{{ replace .Permalink "/es/" "/" }}{{ end }}" />
```

---

## 🔍 SEO/AEO Implementation

### Every Page Gets Complete SEO

```html
<!-- layouts/_default/baseof.html -->
<!DOCTYPE html>
<html lang="{{ .Language.Lang }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- ═══════════ SEO CORE (Every Page) ═══════════ -->
  
  <!-- Title (50-60 chars, keyword-rich) -->
  <title>{{ .Title }} | GirlPilates{{ if eq .Language.Lang "es" }}.com/es{{ end }}</title>
  
  <!-- Meta Description (150-160 chars) -->
  <meta name="description" content="{{ .Description | default .Summary | truncate 160 }}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="{{ .Permalink }}">
  
  <!-- Hreflang (EN + ES + x-default) -->
  {{ partial "head/hreflang.html" . }}
  
  <!-- Robots -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  
  <!-- ═══════════ OPEN GRAPH (Every Page) ═══════════ -->
  <meta property="og:title" content="{{ .Title }}">
  <meta property="og:description" content="{{ .Description | default .Summary | truncate 200 }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta property="og:site_name" content="GirlPilates">
  <meta property="og:locale" content="{{ .Language.Params.locale }}">
  <meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
  {{ with .Params.image }}
  <meta property="og:image" content="{{ . | absURL }}">
  {{ else }}
  <meta property="og:image" content="{{ "/images/og-default.jpg" | absURL }}">
  {{ end }}
  
  <!-- ═══════════ TWITTER CARDS (Every Page) ═══════════ -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ .Title }}">
  <meta name="twitter:description" content="{{ .Description | default .Summary | truncate 200 }}">
  {{ with .Params.image }}
  <meta name="twitter:image" content="{{ . | absURL }}">
  {{ end }}
  
  <!-- ═══════════ SCHEMA.ORG JSON-LD (Every Page) ═══════════ -->
  {{ partial "head/schema.html" . }}
  
  <!-- ═══════════ PERFORMANCE ═══════════ -->
  {{ $css := resources.Get "css/main.css" | postCSS | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}">
  
  <!-- Preconnect for YouTube embeds -->
  <link rel="preconnect" href="https://www.youtube-nocookie.com">
  <link rel="preconnect" href="https://i.ytimg.com">
</head>
<body class="min-h-screen bg-white text-gray-900">
  {{ partial "components/header.html" . }}
  
  <!-- Breadcrumbs (SEO + UX) -->
  {{ if not .IsHome }}
  {{ partial "components/breadcrumbs.html" . }}
  {{ end }}
  
  <main id="main">
    {{ block "main" . }}{{ end }}
  </main>
  
  {{ partial "components/footer.html" . }}
  
  <!-- Deferred JS -->
  {{ $js := resources.Get "js/app.js" | minify | fingerprint }}
  <script src="{{ $js.RelPermalink }}" defer></script>
</body>
</html>
```

### Schema.org (Page-Type Specific)

```html
<!-- layouts/partials/head/schema.html -->
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GirlPilates",
    "url": "{{ .Site.BaseURL }}",
    "inLanguage": ["en", "es"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "{{ .Site.BaseURL }}search/?q={search_term}",
      "query-input": "required name=search_term"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GirlPilates",
    "url": "{{ .Site.BaseURL }}",
    "logo": "{{ "/images/logo.png" | absURL }}",
    "sameAs": [
      "https://youtube.com/@girlpilates",
      "https://instagram.com/girlpilates"
    ]
  }
  {{ if not .IsHome }},
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{ $path := "" }}
      {{ range $i, $seg := split .RelPermalink "/" }}
        {{ if $seg }}
          {{ $path = printf "%s/%s" $path $seg }}
          {{ if $i }},{{ end }}
          {
            "@type": "ListItem",
            "position": {{ add $i 1 }},
            "name": "{{ $seg | humanize | title }}",
            "item": "{{ $path | absURL }}"
          }
        {{ end }}
      {{ end }}
    ]
  }
  {{ end }}
  
  {{/* Exercise-specific schema */}}
  {{ if and (eq .Section "exercises") .IsPage }}
  ,{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "{{ i18n "how_to_do" }} {{ .Title }}",
    "description": "{{ .Description }}",
    "image": "{{ .Params.image | absURL }}",
    "totalTime": "PT{{ div .Params.duration 60 }}M",
    "step": [
      {{ range $i, $step := .Params.steps }}
      {{ if $i }},{{ end }}
      {
        "@type": "HowToStep",
        "position": {{ add $i 1 }},
        "text": "{{ $step }}"
      }
      {{ end }}
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "ExerciseAction",
    "name": "{{ .Title }}",
    "description": "{{ .Description }}",
    "exerciseType": "Pilates"
  }
  {{ if .Params.video_id }}
  ,{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "{{ .Title }}",
    "description": "{{ .Description }}",
    "thumbnailUrl": "https://i.ytimg.com/vi/{{ .Params.video_id }}/maxresdefault.jpg",
    "uploadDate": "{{ .Date.Format "2006-01-02" }}",
    "embedUrl": "https://www.youtube-nocookie.com/embed/{{ .Params.video_id }}"
  }
  {{ end }}
  {{ end }}
  
  {{/* FAQ schema */}}
  {{ if .Params.faq }}
  ,{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {{ range $i, $item := .Params.faq }}
      {{ if $i }},{{ end }}
      {
        "@type": "Question",
        "name": "{{ $item.q }}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{{ $item.a }}"
        }
      }
      {{ end }}
    ]
  }
  {{ end }}
  
  {{/* Article schema for learn section */}}
  {{ if and (eq .Section "learn") .IsPage }}
  ,{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{{ .Title }}",
    "description": "{{ .Description }}",
    "datePublished": "{{ .Date.Format "2006-01-02" }}",
    "dateModified": "{{ .Lastmod.Format "2006-01-02" }}",
    "author": {
      "@type": "Person",
      "name": "{{ with .Params.author }}{{ . }}{{ else }}GirlPilates Team{{ end }}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GirlPilates",
      "logo": {
        "@type": "ImageObject",
        "url": "{{ "/images/logo.png" | absURL }}"
      }
    }
  }
  {{ end }}
  
  {{/* Person schema for teachers */}}
  {{ if and (eq .Section "teachers") .IsPage }}
  ,{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "{{ .Title }}",
    "jobTitle": "{{ .Params.title }}",
    "description": "{{ .Description }}",
    "image": "{{ .Params.photo | absURL }}",
    {{ if .Params.certifications }}
    "hasCredential": [
      {{ range $i, $cert := .Params.certifications }}
      {{ if $i }},{{ end }}
      {
        "@type": "EducationalOccupationalCredential",
        "name": "{{ $cert }}"
      }
      {{ end }}
    ],
    {{ end }}
    "knowsAbout": ["Pilates", "Fitness", "Women's Health"]
  }
  {{ end }}
]
</script>
```

### SEO Checklist (Enforced on Every Page)

| Element | Template Location | Validation |
|---------|-------------------|------------|
| `<title>` | baseof.html | 50-60 chars |
| `<meta description>` | baseof.html | 150-160 chars |
| `<link canonical>` | baseof.html | Absolute URL |
| `hreflang` tags | hreflang.html | en + es + x-default |
| Open Graph | baseof.html | og:title, og:description, og:image, og:url |
| Twitter Cards | baseof.html | card, title, description, image |
| JSON-LD Schema | schema.html | WebSite, Organization, BreadcrumbList + page-specific |
| H1 tag | single.html/list.html | 1 per page |
| Image alt text | All templates | Required attribute |
| Internal links | Content | 3+ per page |

---

## 📱 Mobile-First Design

### Core Web Vitals Targets

| Metric | Target | How We Achieve It |
|--------|--------|-------------------|
| **LCP** | < 2.5s | Static HTML, optimized images, preload critical CSS |
| **FID** | < 100ms | Minimal JS, all deferred |
| **CLS** | < 0.1 | Explicit image dimensions, font-display: swap |
| **TTFB** | < 200ms | GitHub CDN serves static files |

### Responsive Design

```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Mobile-first defaults */
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }
  
  /* Minimum touch target size */
  a, button, input, select {
    min-height: 44px;
  }
  
  /* Safe area for notched phones */
  body {
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}

@layer components {
  /* Container - fluid on mobile, max-width on desktop */
  .container {
    @apply w-full px-4 mx-auto;
    @apply sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl;
  }
  
  /* Exercise card grid */
  .exercise-grid {
    @apply grid gap-4;
    @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
  }
  
  /* Video container (16:9) */
  .video-wrapper {
    @apply relative w-full;
    padding-bottom: 56.25%;
  }
  
  .video-wrapper iframe,
  .video-wrapper lite-youtube {
    @apply absolute inset-0 w-full h-full;
  }
  
  /* Mobile nav (bottom fixed) */
  .mobile-nav {
    @apply fixed bottom-0 inset-x-0 bg-white border-t z-50;
    @apply flex justify-around items-center h-16;
    @apply pb-[env(safe-area-inset-bottom)];
    @apply lg:hidden;
  }
  
  /* Filter sidebar - bottom sheet on mobile */
  .filter-panel {
    @apply fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl z-40;
    @apply transform translate-y-full transition-transform;
    @apply lg:static lg:transform-none lg:shadow-none lg:rounded-none;
  }
  
  .filter-panel.open {
    @apply translate-y-0;
  }
  
  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center;
    @apply px-6 py-3 rounded-lg font-medium;
    @apply transition-all active:scale-95;
  }
  
  .btn-primary {
    @apply bg-pink-600 text-white hover:bg-pink-700;
  }
}
```

### Lazy Video Loading

```html
<!-- layouts/shortcodes/youtube.html -->
{{ $id := .Get "id" }}
{{ $title := .Get "title" | default "Video" }}

<div class="video-wrapper my-6">
  <lite-youtube 
    videoid="{{ $id }}"
    playlabel="{{ i18n "play_video" }}: {{ $title }}"
    style="background-image: url('https://i.ytimg.com/vi/{{ $id }}/hqdefault.jpg');"
  >
    <a href="https://youtube.com/watch?v={{ $id }}" class="lty-playbtn" title="{{ $title }}">
      <span class="lyt-visually-hidden">{{ $title }}</span>
    </a>
  </lite-youtube>
</div>
```

**Performance impact**: Standard YouTube embed loads ~1.2MB. lite-youtube-embed loads ~30KB (97% reduction).

### Mobile Navigation

```html
<!-- layouts/partials/components/header.html -->
<header class="sticky top-0 bg-white/95 backdrop-blur border-b z-30">
  <div class="container flex items-center justify-between h-14">
    <!-- Logo -->
    <a href="{{ .Site.Home.Permalink }}" class="flex items-center gap-2">
      <img src="/images/logo.svg" alt="GirlPilates" width="32" height="32" class="h-8 w-8">
      <span class="font-bold text-pink-600 hidden sm:inline">GirlPilates</span>
    </a>
    
    <!-- Desktop Nav -->
    <nav class="hidden lg:flex items-center gap-6">
      <a href="{{ "/exercises/" | relLangURL }}" class="hover:text-pink-600">{{ i18n "nav_exercises" }}</a>
      <a href="{{ "/workouts/" | relLangURL }}" class="hover:text-pink-600">{{ i18n "nav_workouts" }}</a>
      <a href="{{ "/learn/" | relLangURL }}" class="hover:text-pink-600">{{ i18n "nav_learn" }}</a>
      <a href="{{ "/teachers/" | relLangURL }}" class="hover:text-pink-600">{{ i18n "nav_teachers" }}</a>
    </nav>
    
    <!-- Language + Search -->
    <div class="flex items-center gap-3">
      {{ partial "components/lang-switch.html" . }}
      <button id="search-btn" aria-label="{{ i18n "search" }}" class="p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- Bottom Nav (Mobile Only) -->
<nav class="mobile-nav">
  <a href="{{ .Site.Home.Permalink }}" class="flex flex-col items-center p-2 {{ if .IsHome }}text-pink-600{{ else }}text-gray-500{{ end }}">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    <span class="text-xs">{{ i18n "nav_home" }}</span>
  </a>
  <a href="{{ "/exercises/" | relLangURL }}" class="flex flex-col items-center p-2 {{ if eq .Section "exercises" }}text-pink-600{{ else }}text-gray-500{{ end }}">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
    <span class="text-xs">{{ i18n "nav_exercises" }}</span>
  </a>
  <a href="{{ "/workouts/generator/" | relLangURL }}" class="flex flex-col items-center -mt-4">
    <div class="bg-pink-600 rounded-full p-4 shadow-lg">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
    </div>
    <span class="text-xs text-pink-600 mt-1">{{ i18n "nav_generate" }}</span>
  </a>
  <a href="{{ "/workouts/" | relLangURL }}" class="flex flex-col items-center p-2 {{ if eq .Section "workouts" }}text-pink-600{{ else }}text-gray-500{{ end }}">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
    <span class="text-xs">{{ i18n "nav_workouts" }}</span>
  </a>
  <a href="{{ "/learn/" | relLangURL }}" class="flex flex-col items-center p-2 {{ if eq .Section "learn" }}text-pink-600{{ else }}text-gray-500{{ end }}">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
    <span class="text-xs">{{ i18n "nav_learn" }}</span>
  </a>
</nav>
```

---

## 📄 Content Templates

### Exercise Page (Frontmatter)

```yaml
# content/en/exercises/mat/the-hundred.md
---
title: "The Hundred"
translationKey: "exercise-hundred"
description: "The signature Pilates warm-up that builds core endurance through coordinated breathing and pumping arm movements."
date: 2024-01-15
lastmod: 2024-12-16

# SEO
keywords: ["pilates hundred", "core exercise", "ab workout", "beginner pilates"]

# Exercise Data
equipment: ["mat"]
muscles: ["core", "abs", "hip flexors"]
difficulty: "beginner"
duration: 120  # seconds

# Video
video_id: "abc123xyz"

# Steps (for HowTo schema)
steps:
  - "Lie flat on your back with arms by your sides"
  - "Float legs to tabletop position (knees bent 90°)"
  - "Curl head and shoulders off mat, gaze at navel"
  - "Pump arms vigorously while breathing: inhale 5, exhale 5"
  - "Complete 10 breath cycles (100 arm pumps total)"

# Modifications
modifications:
  - name: "Head Down"
    level: "easier"
    description: "Keep head on mat if neck strains"
  - name: "Legs Extended"
    level: "harder"  
    description: "Extend legs to 45° angle"

# FAQ (generates schema)
faq:
  - q: "How many times should I do the Hundred?"
    a: "Once per workout, typically as your warm-up. The 100 pumps are built into the exercise."
  - q: "Why does my neck hurt during the Hundred?"
    a: "Keep your gaze at your navel and think of lifting from your chest, not straining your neck. Try the head-down modification."

# Attribution
author: "jessica-valant"
image: "/images/exercises/the-hundred.jpg"
---

The Hundred is Joseph Pilates' signature exercise...
```

### Spanish Version

```yaml
# content/es/ejercicios/mat/el-cien.md
---
title: "El Cien"
translationKey: "exercise-hundred"
description: "El ejercicio emblemático de Pilates que desarrolla la resistencia del core mediante respiración coordinada y movimientos de bombeo de brazos."
date: 2024-01-15
lastmod: 2024-12-16

keywords: ["pilates cien", "ejercicio core", "abdominales", "pilates principiante"]

equipment: ["mat"]
muscles: ["core", "abdominales", "flexores de cadera"]
difficulty: "principiante"
duration: 120

video_id: "abc123xyz"

steps:
  - "Acuéstate boca arriba con los brazos a los lados"
  - "Eleva las piernas a posición de mesa (rodillas dobladas 90°)"
  - "Despega cabeza y hombros del mat, mira hacia el ombligo"
  - "Bombea los brazos vigorosamente: inhala 5, exhala 5"
  - "Completa 10 ciclos de respiración (100 bombeos en total)"

modifications:
  - name: "Cabeza Abajo"
    level: "más fácil"
    description: "Mantén la cabeza en el mat si sientes tensión en el cuello"
  - name: "Piernas Extendidas"
    level: "más difícil"
    description: "Extiende las piernas a un ángulo de 45°"

faq:
  - q: "¿Cuántas veces debo hacer El Cien?"
    a: "Una vez por entrenamiento, típicamente como calentamiento. Los 100 bombeos están integrados en el ejercicio."
  - q: "¿Por qué me duele el cuello durante El Cien?"
    a: "Mantén la mirada en el ombligo y piensa en levantar desde el pecho, no en tensar el cuello. Prueba la modificación con cabeza abajo."

author: "jessica-valant"
image: "/images/exercises/the-hundred.jpg"
---

El Cien es el ejercicio emblemático de Joseph Pilates...
```

---

## 🔎 Client-Side Search (Pagefind)

```javascript
// assets/js/search.js
import * as pagefind from '/search/pagefind.js';

async function initSearch() {
  await pagefind.init();
  
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  
  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    const results = await pagefind.search(query);
    
    resultsContainer.innerHTML = results.results
      .slice(0, 10)
      .map(r => `
        <a href="${r.url}" class="block p-3 hover:bg-gray-50 rounded">
          <h3 class="font-medium">${r.meta.title}</h3>
          <p class="text-sm text-gray-600">${r.excerpt}</p>
        </a>
      `)
      .join('');
  });
}

initSearch();
```

Pagefind automatically:
- Indexes all pages at build time
- Creates a ~50KB search bundle
- Searches in the user's current language
- Works 100% client-side (no server needed)

---

## 🎯 Workout Generator (Client-Side)

```javascript
// assets/js/generator.js
class WorkoutGenerator {
  constructor(exercises) {
    this.exercises = exercises;
  }
  
  generate({ duration = 30, equipment = ['mat'], difficulty = 'beginner', focus = 'full_body' }) {
    // Filter exercises
    let pool = this.exercises.filter(ex => {
      const hasEquipment = ex.equipment.some(e => equipment.includes(e));
      const matchesDifficulty = this.difficultyMatch(ex.difficulty, difficulty);
      const matchesFocus = focus === 'full_body' || ex.muscles.includes(focus);
      return hasEquipment && matchesDifficulty && matchesFocus;
    });
    
    // Build balanced workout
    const targetTime = duration * 60; // seconds
    let workout = [];
    let totalTime = 0;
    
    // Add warm-up (always start with foundational)
    const warmups = pool.filter(e => e.tags?.includes('warmup'));
    if (warmups.length) {
      const warmup = this.randomPick(warmups);
      workout.push(warmup);
      totalTime += warmup.duration;
      pool = pool.filter(e => e.id !== warmup.id);
    }
    
    // Fill main workout
    while (totalTime < targetTime * 0.85 && pool.length > 0) {
      const exercise = this.randomPick(pool);
      workout.push(exercise);
      totalTime += exercise.duration;
      pool = pool.filter(e => e.id !== exercise.id);
    }
    
    // Add cooldown
    const cooldowns = this.exercises.filter(e => e.tags?.includes('cooldown'));
    if (cooldowns.length) {
      workout.push(this.randomPick(cooldowns));
    }
    
    return {
      exercises: workout,
      totalDuration: Math.ceil(totalTime / 60),
      equipment: equipment,
      difficulty: difficulty
    };
  }
  
  difficultyMatch(exerciseDiff, targetDiff) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    return levels[exerciseDiff] <= levels[targetDiff];
  }
  
  randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// Initialize with exercise data
fetch('/data/exercises.json')
  .then(r => r.json())
  .then(data => {
    window.generator = new WorkoutGenerator(data.exercises);
  });
```

---

## 🚀 GitHub Pages Deployment

### Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest
          extended: true

      - name: Build site
        run: hugo --minify --gc

      - name: Build search index
        run: npx pagefind --site public

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Custom Domain Setup

1. Add `CNAME` file to `static/`:
```
girlpilates.com
```

2. Configure DNS:
```
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   girlpilates.github.io
```

3. Enable HTTPS in repo Settings → Pages

---

## 📦 Dependencies

```json
{
  "name": "girlpilates",
  "scripts": {
    "dev": "hugo server -D",
    "build": "hugo --minify --gc",
    "postbuild": "npx pagefind --site public"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "autoprefixer": "^10.4.16",
    "pagefind": "^1.0.4",
    "postcss": "^8.4.32",
    "postcss-cli": "^11.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 📊 Content Targets

### Launch (MVP)

| Content | EN | ES | Total |
|---------|----|----|-------|
| Exercises | 100 | 100 | 200 |
| Workouts | 15 | 15 | 30 |
| Learn articles | 25 | 25 | 50 |
| Teacher profiles | 10 | 10 | 20 |
| **Total pages** | **150** | **150** | **300** |

### Month 6

| Content | EN | ES | Total |
|---------|----|----|-------|
| Exercises | 300 | 300 | 600 |
| Workouts | 50 | 50 | 100 |
| Learn articles | 100 | 100 | 200 |
| Teacher profiles | 50 | 50 | 100 |
| **Total pages** | **500** | **500** | **1,000** |

### Month 12

| Content | EN | ES | Total |
|---------|----|----|-------|
| Exercises | 500 | 500 | 1,000 |
| Workouts | 100 | 100 | 200 |
| Learn articles | 200 | 200 | 400 |
| Teacher profiles | 100 | 100 | 200 |
| Studios | 250 | 250 | 500 |
| **Total pages** | **1,150** | **1,150** | **2,300** |

---

## 💰 Monetization (Zero Paywalls)

| Revenue Stream | Implementation | Projected (at 250K/mo) |
|---------------|----------------|------------------------|
| Display ads | Mediavine/AdThrive | $3,000-5,000/mo |
| Affiliates | Equipment, apparel | $5,000-10,000/mo |
| Sponsorships | Brand partnerships | $3,000-8,000/mo |
| **Total** | | **$11,000-23,000/mo** |

### Affiliate Programs

| Partner | Commission | Products |
|---------|-----------|----------|
| Amazon Associates | 3-4% | Props, mats, books |
| Balanced Body | 8% | Reformers, equipment |
| Alo Yoga | 8-15% | Apparel |
| Manduka | 6% | Mats, props |

---

## 🛠️ Local Development

```bash
# Clone
git clone https://github.com/girlpilates/girlpilates.com.git
cd girlpilates.com

# Install
npm install

# Run dev server
npm run dev
# → http://localhost:1313 (EN)
# → http://localhost:1313/es/ (ES)

# Build production
npm run build
```

---

## ✅ Pre-Launch Checklist

- [x] All pages have EN + ES versions
- [x] All pages pass schema validation (search.google.com/test/rich-results)
- [x] Lighthouse mobile score > 90 on all metrics
- [x] robots.txt allows crawling
- [ ] XML sitemaps generated (sitemap.xml, sitemap-en.xml, sitemap-es.xml)
- [ ] Custom domain configured with HTTPS
- [ ] Analytics installed
- [ ] Search console verified for both languages
- [ ] Social meta images generated (1200x630)

---

<p align="center">
  <strong>🌍 Free Pilates for Every Woman, Everywhere</strong><br>
  <strong>🌎 Pilates Gratis para Todas las Mujeres</strong><br><br>
  Built with ❤️ on GitHub Pages
</p>
