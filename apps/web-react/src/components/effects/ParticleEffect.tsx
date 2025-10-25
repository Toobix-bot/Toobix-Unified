'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface ParticleEffectProps {
  count?: number
  colors?: string[]
  trigger?: boolean
  continuous?: boolean
}

export function ParticleEffect({
  count = 20,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  trigger = false,
  continuous = false
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particle
    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * -3 - 1,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 100 + Math.random() * 100
      }
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life++
        particle.opacity = 1 - (particle.life / particle.maxLife)

        // Draw
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.globalAlpha = 1

        // Reset or remove particle
        if (particle.life >= particle.maxLife) {
          if (continuous) {
            // Reset particle at bottom
            particlesRef.current[index] = createParticle(
              Math.random() * canvas.width,
              canvas.height + 10
            )
          } else {
            particlesRef.current.splice(index, 1)
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    if (trigger || continuous) {
      initParticles()
      animate()
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [trigger, continuous, count, colors])

  return (
    <canvas
      ref={canvasRef}
      className="particles-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}

// Confetti Effect Component
export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  return (
    <ParticleEffect
      count={50}
      colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
      trigger={trigger}
      continuous={false}
    />
  )
}

// Sparkle Effect Component
export function SparkleEffect() {
  return (
    <ParticleEffect
      count={15}
      colors={['#ffffff', '#ffe666', '#ffb347']}
      continuous={true}
    />
  )
}
