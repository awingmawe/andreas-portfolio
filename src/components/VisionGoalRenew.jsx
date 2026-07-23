'use client'

/**
 * VisionGoalRenew
 * ----------------
 * A full-screen, animated "coming soon / brand renewal" teaser for the renewed
 * Vision Goal platform (https://vision-goal-renew.vercel.app/ — in progress).
 *
 * Light theme, matching the live visiongoal.ch brand:
 *  - soft ice-blue canvas (#e2ecf6) with a faint paper-noise texture
 *  - deep navy (#063970) text in thin Segoe UI weights (Swiss-precision feel)
 *  - the REAL logo asset as the hero, gently floating over an ice halo
 *  - a signature "ascending progress bar" that climbs on load and brightens
 *  - a single saturated accent (#2b4bd6, the wordmark blue) used sparingly
 *
 * Self-contained: bilingual copy lives here (keyed by the next-intl locale) so
 * the rest of the site's copy can stay hidden while this page carries the story.
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

// The in-progress preview of the new platform.
const PREVIEW_URL = 'https://vision-goal-renew.vercel.app/'

// -- Brand palette (light theme) ----------------------------------------------
const NAVY = '#063970' // primary text / logo circle
const BLUE = '#2b4bd6' // the one saturated accent (the wordmark "Vision" blue)
const ICE = '#bbe3fd' // fills / halos / progress tail — never readable text
const FONT = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
const navy = a => `rgba(6,57,112,${a})` // muted-navy helper

// Signature expo-out easing shared by every motion.
const EASE = [0.16, 1, 0.3, 1]
const TARGET = 68 // % the "in progress" bar climbs to

// Faint paper-noise texture (self-contained SVG data URI — no external asset).
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// -- Bilingual copy -----------------------------------------------------------
const COPY = {
  en: {
    badge: 'The renewal is underway',
    eyebrow: 'The next evolution of',
    headline: { pre: 'A new ', accent: 'vision', line2: 'is taking shape.' },
    body: "We're reimagining how we guide your wealth, your goals, and your future. A renewed Vision Goal experience is on its way — bolder, clearer, and built entirely around you.",
    progress: 'In progress',
    cta: 'Preview the new Vision Goal',
    ctaNote: 'Work in progress — the preview is still evolving',
    footer: '© 2026 Vision Goal · Zürich, Switzerland',
  },
  de: {
    badge: 'Die Erneuerung läuft',
    eyebrow: 'Die nächste Entwicklung von',
    headline: { pre: 'Eine neue ', accent: 'Vision', line2: 'nimmt Gestalt an.' },
    body: 'Wir denken neu, wie wir Ihr Vermögen, Ihre Ziele und Ihre Zukunft begleiten. Ein erneuertes Vision-Goal-Erlebnis ist auf dem Weg — mutiger, klarer und ganz auf Sie ausgerichtet.',
    progress: 'In Arbeit',
    cta: 'Die neue Vision Goal ansehen',
    ctaNote: 'In Arbeit — die Vorschau entwickelt sich noch',
    footer: '© 2026 Vision Goal · Zürich, Schweiz',
  },
}

export default function VisionGoalRenew() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const locale = useLocale()
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const t = COPY[locale] || COPY.en

  // Whisper-soft pointer parallax, driven via motion values (no React re-render).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 50, damping: 22 })
  const sy = useSpring(py, { stiffness: 50, damping: 22 })
  const logoPX = useTransform(sx, v => v * 6)
  const logoPY = useTransform(sy, v => v * 6)
  const glowPX = useTransform(sx, v => v * -16)
  const glowPY = useTransform(sy, v => v * -16)

  const handlePointer = useCallback(
    e => {
      if (prefersReduced) return
      px.set(e.clientX / window.innerWidth - 0.5)
      py.set(e.clientY / window.innerHeight - 0.5)
    },
    [px, py, prefersReduced],
  )

  // Count-up % caption that climbs in lockstep with the progress fill.
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

  // Per-item reveal — content grows UP the page on load. Explicit per-item props
  // (not parent-orchestrated variants) so nothing can get stuck at hidden.
  const reveal = i =>
    prefersReduced
      ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 },
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
        position: 'relative',
        minHeight: '100vh',
        '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
        fontFamily: FONT,
        color: NAVY,
        px: 2,
        py: { xs: 7, md: 6 },
      }}
    >
      {/* ---------- Fixed, viewport-clipped background ---------- */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, #eef4fb 0%, #e2ecf6 50%, #dae7f4 100%)',
        }}
      >
        {/* soft diagonal ice glow, rising lower-left → upper-right */}
        <motion.div style={{ position: 'absolute', inset: 0, x: glowPX, y: glowPY }}>
          <motion.div
            animate={prefersReduced ? {} : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(55% 45% at 68% 32%, rgba(187,227,253,0.34) 0%, rgba(187,227,253,0) 70%)',
            }}
          />
        </motion.div>
        {/* faint paper-noise texture */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE,
            backgroundRepeat: 'repeat',
            opacity: 0.04,
            mixBlendMode: 'multiply',
          }}
        />
      </Box>

      {/* ---------- Top utility row: language toggle ---------- */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 20, md: 32 },
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

      {/* ---------- Centered editorial content ---------- */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 760,
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 'clamp(24px, 6vw, 72px)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo — the real asset, floating over an ice halo */}
          <motion.div {...reveal(0)}>
            <motion.div
              style={{ x: logoPX, y: logoPY, position: 'relative', display: 'inline-block' }}
            >
              <motion.div
                aria-hidden
                animate={prefersReduced ? {} : { opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '-38px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(187,227,253,0.5) 0%, rgba(187,227,253,0) 66%)',
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
                  sizes='150px'
                  style={{
                    width: isMobile ? 108 : 150,
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <Box sx={{ height: { xs: 30, md: 38 } }} />

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
                background: 'rgba(187,227,253,0.35)',
                border: `1px solid ${navy(0.14)}`,
              }}
            >
              <Box
                component={motion.span}
                animate={prefersReduced ? {} : { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: BLUE,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 11, md: 12 },
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

          <Box sx={{ height: { xs: 22, md: 26 } }} />

          {/* Eyebrow */}
          <motion.div {...reveal(2)}>
            <Typography
              sx={{
                fontSize: { xs: 12, md: 13 },
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: navy(0.78),
              }}
            >
              {t.eyebrow}
            </Typography>
          </motion.div>

          <Box sx={{ height: 12 }} />

          {/* Headline — thin, navy, with the single accent word in wordmark blue */}
          <motion.div {...reveal(3)}>
            <Typography
              component='h1'
              sx={{
                m: 0,
                fontWeight: 300,
                fontSize: 'clamp(2.2rem, 6vw, 3.75rem)',
                lineHeight: 1.12,
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

          <Box sx={{ height: { xs: 24, md: 28 } }} />

          {/* Body */}
          <motion.div {...reveal(4)}>
            <Typography
              sx={{
                maxWidth: 520,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.0625rem' },
                lineHeight: 1.7,
                fontWeight: 400,
                color: navy(0.85),
              }}
            >
              {t.body}
            </Typography>
          </motion.div>

          <Box sx={{ height: { xs: 28, md: 34 } }} />

          {/* Signature — the ascending progress bar */}
          <motion.div {...reveal(5)} style={{ width: '100%', maxWidth: 520 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                mb: 1.25,
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

            <Box
              sx={{
                position: 'relative',
                height: 4,
                borderRadius: 999,
                background: navy(0.1),
              }}
            >
              {/* fill wrapper — animates width; carries the chevron at its edge */}
              <Box
                component={motion.div}
                initial={{ width: 0 }}
                animate={{ width: `${TARGET}%` }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { duration: 1.6, delay: 1.0, ease: EASE }
                }
                sx={{ position: 'absolute', left: 0, top: 0, height: '100%' }}
              >
                {/* gradient fill (brightens as it climbs) + specular shimmer */}
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
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.8,
                      }}
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

                {/* upward chevron riding the leading edge (echoes the logo arrow) */}
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

          <Box sx={{ height: { xs: 28, md: 34 } }} />

          {/* CTA — the single navy-filled element on the page */}
          <motion.div {...reveal(6)}>
            <Box
              component={motion.div}
              whileHover={prefersReduced ? {} : { scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              sx={{ display: 'inline-block' }}
            >
              <Button
                href={PREVIEW_URL}
                target='_blank'
                rel='noopener noreferrer'
                endIcon={<ArrowOutwardIcon sx={{ transition: 'transform .25s ease' }} />}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  background: NAVY,
                  boxShadow: `0 10px 30px ${navy(0.18)}`,
                  '&:hover': {
                    background: NAVY,
                    boxShadow: `0 14px 40px ${navy(0.28)}`,
                    '& .MuiButton-endIcon': { transform: 'translate(2px, -2px)' },
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${BLUE}`,
                    outlineOffset: 3,
                  },
                }}
              >
                {t.cta}
              </Button>
            </Box>
            <Typography sx={{ mt: 2, fontSize: 12.5, color: navy(0.78) }}>
              {t.ctaNote}
            </Typography>
          </motion.div>
        </Box>
      </Container>

      {/* ---------- Footer ---------- */}
      <Box
        component={motion.footer}
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
          mt: { xs: 6, md: 4 },
          pb: 1,
          px: 3,
        }}
      >
        <Box sx={{ height: '1px', width: '100%', background: navy(0.12), mb: 2 }} />
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
