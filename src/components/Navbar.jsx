'use client'

import { AppBar, Toolbar, Typography } from '@mui/material'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [shrink, setShrink] = useState(false)

  useEffect(() => {
    return scrollY.onChange(latest => {
      setShrink(latest > 50)
    })
  }, [scrollY])

  const scale = useSpring(shrink ? 0.9 : 1, { stiffness: 300, damping: 20 })

  return (
    <motion.div style={{ scale }}>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6'>My Website</Typography>
        </Toolbar>
      </AppBar>
    </motion.div>
  )
}
