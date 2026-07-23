'use client'

/**
 * VisionGoalRenew
 * ----------------
 * Full-screen, non-scrolling "brand renewal" teaser for Vision Goal.
 *
 * Light theme matching visiongoal.ch, but with a living web3-style backdrop:
 * drifting mesh-gradient blobs, floating light orbs and a slow animated grid,
 * kept legible by a soft white veil behind the centered content.
 *
 * - No outbound link to the in-progress site. The CTA is a plain contact mailto.
 * - The viewport is locked (100dvh, overflow hidden, body scroll disabled).
 * - Bilingual (EN / DE) via the next-intl locale.
 */

import {
  Box,
  Container,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import Image from 'next/image'
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from '../i18n/routing'
import Logo from '../assets/thumbnail.png'

// Public contact address (shown on the live site's contact section).
const CONTACT_EMAIL = 'info@visiongoal.ch'

// -- Brand palette (light theme) ----------------------------------------------
const NAVY = '#063970'
const BLUE = '#2b4bd6' // the saturated wordmark accent
const ICE = '#bbe3fd'
const FONT = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
const navy = a => `rgba(6,57,112,${a})`

const EASE = [0.16, 1, 0.3, 1]
const TARGET = 68 // % the "in progress" bar climbs to

// Faint paper-noise texture (self-contained SVG data URI).
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Drifting mesh-gradient blobs (the web3 backdrop).
const BLOBS = [
  { c: 'rgba(43,75,214,0.40)', size: 52, top: '-14%', left: '-12%', dx: 70, dy: 50, s: 1.25, dur: 20, delay: 0 },
  { c: 'rgba(74,168,255,0.34)', size: 44, top: '14%', left: '60%', dx: -80, dy: 60, s: 1.3, dur: 24, delay: 1.5 },
  { c: 'rgba(124,92,255,0.32)', size: 46, top: '52%', left: '2%', dx: 80, dy: -55, s: 1.25, dur: 27, delay: 1 },
  { c: 'rgba(34,211,238,0.30)', size: 38, top: '-6%', left: '46%', dx: -55, dy: 70, s: 1.35, dur: 22, delay: 2.5 },
  { c: 'rgba(99,102,241,0.28)', size: 42, top: '58%', left: '60%', dx: -70, dy: -45, s: 1.25, dur: 29, delay: 0.5 },
]

// Deterministic floating orbs (seeded so SSR & client match exactly).
function buildOrbs(count) {
  let seed = 20260724
  const rand = () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 4 + rand() * 10,
    dur: 10 + rand() * 10,
    delay: rand() * 8,
    drift: 30 + rand() * 50,
    hue: rand(),
  }))
}
const ORBS = buildOrbs(14)

export default function VisionGoalRenew() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const locale = useLocale()
  const router = useRouter()
  const prefersReduced = useReducedMotion()

  const COPY = {
    en: {
      badge: 'The renewal is underway',
      eyebrow: 'The next evolution of',
      headline: { pre: 'A new ', accent: 'vision', line2: 'is taking shape.' },
      body: "We're reimagining how we guide your wealth, your goals, and your future. A renewed Vision Goal experience is on its way — bolder, clearer, and built entirely around you.",
      progress: 'In progress',
      cta: 'Get in touch',
      footer: '© 2026 Vision Goal · Zürich, Switzerland',
    },
    de: {
      badge: 'Die Erneuerung läuft',
      eyebrow: 'Die nächste Entwicklung von',
      headline: { pre: 'Eine neue ', accent: 'Vision', line2: 'nimmt Gestalt an.' },
      body: 'Wir denken neu, wie wir Ihr Vermögen, Ihre Ziele und Ihre Zukunft begleiten. Ein erneuertes Vision-Goal-Erlebnis ist auf dem Weg — mutiger, klarer und ganz auf Sie ausgerichtet.',
      progress: 'In Arbeit',
      cta: 'Kontakt aufnehmen',
      footer: '© 2026 Vision Goal · Zürich, Schweiz',
    },
  }
  const t = COPY[locale] || COPY.en

  // Lock the page — no scrolling.
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prev = {
      ho: html.style.overflow,
      bo: body.style.overflow,
      ob: body.style.overscrollBehavior,
    }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    return () => {
      html.style.overflow = prev.ho
      body.style.overflow = prev.bo
      body.style.overscrollBehavior = prev.ob
    }
  }, [])

  // Whisper-soft pointer parallax for the backdrop.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 45, damping: 22 })
  const sy = useSpring(py, { stiffness: 45, damping: 22 })
  const bgX = useTransform(sx, v => v * 30)
  const bgY = useTransform(sy, v => v * 30)
  const gridX = useTransform(sx, v => v * -14)
  const gridY = useTransform(sy, v => v * -14)

  const handlePointer = useCallback(
    e => {
      if (prefersReduced) return
      px.set(e.clientX / window.innerWidth - 0.5)
      py.set(e.clientY / window.innerHeight - 0.5)
    },
    [px, py, prefersReduced],
  )

  // Count-up % caption, in lockstep with the progress fill.
  const pctRef = useRef(null)
  useEffect(() => {
    const el = pctRef.current
    if (!el) return
    if (prefersReduced) {
      el.textContent = `${TARGET}%`
      return
    }
    const controls = animate(0, TARGET, {
      duration: 1.6,
      delay: 1.0,
      ease: EASE,
      onUpdate: v => {
        el.textContent = `${Math.round(v)}%`
      },
    })
    return () => controls.stop()
  }, [prefersReduced])

  const switchLocale = l => {
    if (l !== locale) router.replace('/', { locale: l })
  }

  // Per-item reveal.
  const reveal = i =>
    prefersReduced
      ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.11 },
        }

  const langBtn = l => (
    <Box
      component='button'
      onClick={() => switchLocale(l)}
      aria-label={`Switch language to ${l.toUpperCase()}`}
      aria-current={locale === l ? 'true' : undefined}
      sx={{
        background: 'none',
        border: 0,
        p: 0,
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: 13,
        letterSpacing: '0.06em',
        fontWeight: locale === l ? 600 : 400,
        color: locale === l ? BLUE : navy(0.78),
        transition: 'color .2s ease',
        '&:hover': { color: locale === l ? BLUE : navy(0.95) },
      }}
    >
      {l.toUpperCase()}
    </Box>
  )

  return (
    <Box
      component='main'
      onMouseMove={handlePointer}
      sx={{
        position: 'fixed',
        inset: 0,
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT,
        color: NAVY,
        px: 2,
      }}
    >
      {/* ---------- Web3 animated backdrop ---------- */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, #eef4fb 0%, #e6eefb 45%, #e2ecf6 72%, #dae7f4 100%)',
        }}
      >
        {/* drifting mesh-gradient blobs */}
        <motion.div style={{ position: 'absolute', inset: '-10%', x: bgX, y: bgY }}>
          {BLOBS.map((b, i) => (
            <motion.div
              key={i}
              animate={
                prefersReduced
                  ? {}
                  : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, b.s, 1] }
              }
              transition={{
                duration: b.dur,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay,
              }}
              style={{
                position: 'absolute',
                top: b.top,
                left: b.left,
                width: `${b.size}vmax`,
                height: `${b.size}vmax`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 50% 50%, ${b.c} 0%, rgba(0,0,0,0) 66%)`,
                filter: 'blur(28px)',
                willChange: 'transform',
              }}
            />
          ))}
        </motion.div>

        {/* slow animated grid */}
        <motion.div style={{ position: 'absolute', inset: '-80px', x: gridX, y: gridY }}>
          <motion.div
            animate={prefersReduced ? {} : { x: [0, 60], y: [0, 60] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(6,57,112,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6,57,112,0.06) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage:
                'radial-gradient(120% 90% at 50% 45%, #000 10%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(120% 90% at 50% 45%, #000 10%, transparent 80%)',
            }}
          />
        </motion.div>

        {/* floating light orbs */}
        {ORBS.map((o, i) => (
          <motion.span
            key={i}
            animate={
              prefersReduced
                ? {}
                : { y: [0, -o.drift, 0], opacity: [0.15, 0.55, 0.15] }
            }
            transition={{
              duration: o.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: o.delay,
            }}
            style={{
              position: 'absolute',
              left: `${o.left}%`,
              top: `${o.top}%`,
              width: o.size,
              height: o.size,
              borderRadius: '50%',
              background:
                o.hue > 0.5
                  ? 'radial-gradient(circle, rgba(124,92,255,0.9), rgba(124,92,255,0))'
                  : 'radial-gradient(circle, rgba(74,168,255,0.9), rgba(74,168,255,0))',
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* soft white veil — keeps the centered content legible */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(62% 54% at 50% 46%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.35) 52%, rgba(255,255,255,0) 78%)',
          }}
        />

        {/* faint paper-noise */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE,
            backgroundRepeat: 'repeat',
            opacity: 0.035,
            mixBlendMode: 'multiply',
          }}
        />
      </Box>

      {/* ---------- Top utility row: language toggle ---------- */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 28 },
          right: 0,
          left: 0,
          px: { xs: 3, md: 6 },
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {langBtn('en')}
          <Box component='span' sx={{ color: navy(0.25), fontSize: 13 }}>
            /
          </Box>
          {langBtn('de')}
        </Box>
      </Box>

      {/* ---------- Centered content (fits the viewport, never scrolls) ---------- */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 760,
          position: 'relative',
          zIndex: 2,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 'clamp(14px, 3.8vh, 50px)',
          px: 'clamp(28px, 6.5vw, 88px)',
          py: 'clamp(8px, 2vh, 28px)',
        }}
      >
        {/* Logo — the real asset, floating over an ice halo */}
        <motion.div {...reveal(0)}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <motion.div
              aria-hidden
              animate={prefersReduced ? {} : { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: '-34px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(187,227,253,0.55) 0%, rgba(187,227,253,0) 66%)',
                zIndex: 0,
              }}
            />
            <motion.div
              animate={prefersReduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Image
                src={Logo}
                alt='Vision Goal'
                priority
                sizes='140px'
                style={{
                  width: 'clamp(94px, min(21vmin, 17vh), 150px)',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </motion.div>
          </Box>
        </motion.div>

        {/* Status badge */}
        <motion.div {...reveal(1)}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.75,
              py: 0.6,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(6px)',
              border: `1px solid ${navy(0.14)}`,
            }}
          >
            <Box
              component={motion.span}
              animate={prefersReduced ? {} : { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              sx={{ width: 7, height: 7, borderRadius: '50%', background: BLUE }}
            />
            <Typography
              sx={{
                fontSize: { xs: 11.5, md: 12.5 },
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: navy(0.85),
              }}
            >
              {t.badge}
            </Typography>
          </Box>
        </motion.div>

        {/* Eyebrow */}
        <motion.div {...reveal(2)}>
          <Typography
            sx={{
              fontSize: { xs: 12.5, md: 14 },
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: navy(0.78),
            }}
          >
            {t.eyebrow}
          </Typography>
        </motion.div>

        {/* Headline */}
        <motion.div {...reveal(3)}>
          <Typography
            component='h1'
            sx={{
              m: 0,
              fontWeight: 300,
              fontSize: 'clamp(2.05rem, min(5.6vw, 7.6vh), 3.9rem)',
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
              color: NAVY,
            }}
          >
            {t.headline.pre}
            <Box component='span' sx={{ color: BLUE, fontWeight: 300 }}>
              {t.headline.accent}
            </Box>
            <Box component='span' sx={{ display: 'block' }}>
              {t.headline.line2}
            </Box>
          </Typography>
        </motion.div>

        {/* Body */}
        <motion.div {...reveal(4)}>
          <Typography
            sx={{
              maxWidth: 580,
              mx: 'auto',
              fontSize: 'clamp(1rem, min(1.55vw, 2.3vh), 1.18rem)',
              lineHeight: 1.78,
              fontWeight: 400,
              color: navy(0.85),
            }}
          >
            {t.body}
          </Typography>
        </motion.div>

        {/* Signature — ascending progress bar (no outbound link) */}
        <motion.div {...reveal(5)} style={{ width: '100%', maxWidth: 544 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              mb: 1.1,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: navy(0.78),
              }}
            >
              {t.progress}
            </Typography>
            <Box
              component='span'
              ref={pctRef}
              sx={{ fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, color: BLUE }}
            >
              0%
            </Box>
          </Box>

          <Box sx={{ position: 'relative', height: 4, borderRadius: 999, background: navy(0.1) }}>
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: `${TARGET}%` }}
              transition={
                prefersReduced ? { duration: 0 } : { duration: 1.6, delay: 1.0, ease: EASE }
              }
              sx={{ position: 'absolute', left: 0, top: 0, height: '100%' }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: `linear-gradient(90deg, ${NAVY} 0%, ${BLUE} 60%, ${ICE} 100%)`,
                }}
              >
                {!prefersReduced && (
                  <Box
                    component={motion.div}
                    animate={{ x: ['-40%', '160%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2.8 }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: '45%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
                    }}
                  />
                )}
              </Box>
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  right: -5,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: BLUE,
                  display: 'flex',
                  filter: 'drop-shadow(0 0 4px rgba(187,227,253,0.9))',
                }}
              >
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path
                    d='M6 3 L10 8 M6 3 L2 8'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* CTA — contact only (no link to the new site) */}
        <motion.div {...reveal(6)}>
          <Box
            component={motion.div}
            whileHover={prefersReduced ? {} : { scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            sx={{ display: 'inline-block' }}
          >
            <Button
              href={`mailto:${CONTACT_EMAIL}`}
              endIcon={<ArrowOutwardIcon sx={{ transition: 'transform .25s ease' }} />}
              sx={{
                px: 5.5,
                py: 1.55,
                borderRadius: 999,
                textTransform: 'none',
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 15.5,
                letterSpacing: '0.02em',
                color: '#ffffff',
                background: NAVY,
                boxShadow: `0 10px 30px ${navy(0.22)}`,
                '&:hover': {
                  background: NAVY,
                  boxShadow: `0 14px 40px ${navy(0.3)}`,
                  '& .MuiButton-endIcon': { transform: 'translate(2px, -2px)' },
                },
                '&:focus-visible': { outline: `2px solid ${BLUE}`, outlineOffset: 3 },
              }}
            >
              {t.cta}
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* ---------- Footer ---------- */}
      <Box
        component={motion.footer}
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
          pb: { xs: 2, md: 2.5 },
          px: 3,
        }}
      >
        <Box sx={{ height: '1px', width: '100%', background: navy(0.12), mb: 1.5 }} />
        <Typography
          sx={{
            fontSize: 12,
            letterSpacing: '0.08em',
            color: navy(0.78),
            textAlign: 'center',
          }}
        >
          {t.footer}
        </Typography>
      </Box>
    </Box>
  )
}
