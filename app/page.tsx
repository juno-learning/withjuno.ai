"use client"

import { Dithering } from "@paper-design/shaders-react"
import { AnimatedMarkdown } from "flowtoken"
import { MegaphoneOff, X } from 'lucide-react';
import "flowtoken/dist/styles.css"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const BANNER_TEXT = "Juno AI raises $500k from Australian Economic Accelerator"

const MAIN_CONTENT = `# Foundation models built for education

We build AI models and learning tools designed from the ground up with pedagogy in mind—for schools and institutions.

**Models** — LLMs trained to teach, not just answer. Pedagogy embedded at the core.

**Tools** — Learning applications powered by our models, tailored to curricula.

**Research** — New ML benchmarks to measure what matters in education.

**Sovereignty** — Institution and student data stays private. Your servers, or ours, but always off big-cloud platforms.`

function JunoLogo({ isDarkMode }: { isDarkMode: boolean }) {
  const fillColor = isDarkMode ? "#EDF2FF" : "#000000"
  
  return (
    <svg viewBox="479 398 341 105" className="h-6 w-auto">
      <g fill={fillColor}>
        <path d="M514.71,401.46c-1.81-1.81-4.06-2.72-6.75-2.72s-4.95.91-6.76,2.72c-1.81,1.81-2.72,4.02-2.72,6.64s.91,4.83,2.72,6.64c1.81,1.81,4.06,2.71,6.76,2.71s4.94-.9,6.75-2.71c1.81-1.81,2.72-4.02,2.72-6.64s-.91-4.83-2.72-6.64ZM500.45,426.11v75.16c10.01-2.27,15.01-9.15,15.01-20.61v-54.55h-15.01Z"/>
        <path d="M587.19,470.47c-3.31,0-4.97-1.66-4.97-4.97v-39.39h-15.01v33.15c0,3.78-1.2,6.82-3.59,9.13-2.38,2.31-5.5,3.46-9.35,3.46-3.62,0-6.55-1.11-8.78-3.35-2.23-2.23-3.35-5.23-3.35-9.01v-33.38h-15.01v37.77c0,6.78,2.04,12.23,6.12,16.35,4.08,4.12,9.43,6.18,16.05,6.18,8.16,0,14.56-3.39,19.18-10.17,2.23,5.85,7.43,8.78,15.59,8.78h4.27v-14.55h-1.15Z"/>
        <path d="M655.57,470.47c-3.31,0-4.96-1.66-4.96-4.97v-17.9c0-6.93-2.1-12.48-6.3-16.63-4.19-4.16-9.76-6.24-16.69-6.24-7.85,0-14.09,2.89-18.71,8.66v-7.28h-15.01v58.91h15.01v-32.34c0-4,1.27-7.24,3.81-9.7,2.54-2.47,5.89-3.7,10.05-3.7,3.85,0,6.95,1.2,9.3,3.58,2.35,2.39,3.52,5.59,3.52,9.59v16.28c0,10.86,5.66,16.29,16.98,16.29h4.28v-14.55h-1.28Z"/>
        <path d="M716.5,433.56c-6.05-5.89-13.58-8.83-22.59-8.83s-16.53,2.94-22.58,8.83c-6.04,5.89-9.06,13.23-9.06,22.01s3.02,16.11,9.06,22c6.05,5.89,13.58,8.84,22.58,8.84s16.54-2.95,22.59-8.84c6.04-5.89,9.06-13.22,9.06-22s-3.02-16.12-9.06-22.01ZM705.47,467.18c-3.09,3.11-6.94,4.67-11.56,4.67s-8.47-1.56-11.54-4.67c-3.09-3.12-4.63-6.99-4.63-11.61s1.54-8.49,4.63-11.61c3.07-3.12,6.92-4.68,11.54-4.68s8.47,1.56,11.56,4.68c3.07,3.12,4.61,6.99,4.61,11.61s-1.54,8.49-4.61,11.61Z"/>
        <path d="M803.37,475.43c-1.77,0-3.19-.53-4.27-1.61-1.08-1.08-1.62-2.5-1.62-4.28v-43.43h-9.93v11.21c-2.46-3.93-5.68-7.01-9.64-9.24-3.97-2.23-8.38-3.35-13.23-3.35-8.39,0-15.4,2.94-21.02,8.83-5.62,5.89-8.43,13.23-8.43,22.01s2.81,16.11,8.43,22c5.62,5.89,12.63,8.84,21.02,8.84,4.85,0,9.28-1.14,13.28-3.41,4.01-2.27,7.24-5.41,9.71-9.41.38,3.69,1.75,6.52,4.1,8.48,2.34,1.97,5.56,2.95,9.64,2.95h3.12v-9.59h-1.16ZM781.54,470.76c-4,4.04-9,6.06-15.01,6.06s-11.13-2.02-15.13-6.06c-4-4.05-6.01-9.11-6.01-15.19s2.01-11.15,6.01-15.19,9.05-6.06,15.13-6.06,11.01,2.02,15.01,6.06c4.01,4.04,6.01,9.11,6.01,15.19s-2,11.14-6.01,15.19Z"/>
        <path d="M809.15,426.11v58.91h9.93v-58.91h-9.93ZM818.79,403.01c-1.27-1.23-2.83-1.84-4.68-1.84s-3.52.61-4.79,1.84c-1.27,1.24-1.91,2.82-1.91,4.74s.64,3.41,1.91,4.68,2.87,1.9,4.79,1.9,3.41-.63,4.68-1.9c1.27-1.27,1.91-2.83,1.91-4.68s-.64-3.5-1.91-4.74Z"/>
      </g>
      <path fill={fillColor} d="M479.3,482.37h16.53v18.89h0c-9.12,0-16.53-7.41-16.53-16.53v-2.36h0Z"/>
    </svg>
  )
}

function PartnerLogos() {
  return (
    <div className="flex items-center gap-8">
      <img src="/logos/aea.png" alt="AEA" className="h-10 w-auto" />
      <img src="/logos/unsw.png" alt="UNSW" className="h-10 w-auto" />
      <img src="/logos/dcc.svg" alt="DCC" className="h-10 w-auto" />
    </div>
  )
}

function useStreamedContent(content: string, durationMs: number = 2500) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const words = useRef(content.split(/(\s+)/))

  useEffect(() => {
    const parts = words.current
    const interval = durationMs / parts.length
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i >= parts.length) {
        setDisplayed(content)
        setDone(true)
        clearInterval(timer)
      } else {
        setDisplayed(parts.slice(0, i).join(""))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [content, durationMs])

  return { displayed, done }
}

const contactFields = [
  { label: "Full name", name: "name", placeholder: "First and last name", type: "text" },
  { label: "Email address", name: "email", placeholder: "me@company.com", type: "email" },
  { label: "Company name", name: "company", placeholder: "Company name", type: "text", optional: true },
  { label: "Your message", name: "message", placeholder: "Write your message", type: "textarea" },
]

function ContactForm({ onClose }: { onClose: () => void }) {
  const [result, setResult] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setResult("")
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append("access_key", "d819be19-8edf-4421-90b3-8793f9280ce5")
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data.success ? "Success!" : "Error")
      if (data.success) {
        form.reset()
        onClose()
      }
    } catch {
      setResult("Something went wrong!")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium">Get in touch</h2>
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close contact form"
        >
          <X size={20} />
        </Button> */}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="space-y-6 md:w-1/3 shrink-0">
            <div>
              <h3 className="text-sm font-medium">Careers</h3>
              <a href="mailto:careers@withjuno.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                careers@withjuno.ai
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium">Press</h3>
              <a href="mailto:media@withjuno.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                media@withjuno.ai
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            {contactFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <Label className="text-xs">
                  {field.label}
                  {field.optional && <span className="text-muted-foreground/60"> (optional)</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea name={field.name} placeholder={field.placeholder} className="min-h-25 resize-none" />
                ) : (
                  <Input type={field.type} name={field.name} placeholder={field.placeholder} />
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={submitting}>Submit</Button>
              <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
            </div>
            {result && <p className="text-sm text-muted-foreground">{result}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default function JunoLanding() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const { displayed: streamedContent, done: streamDone } = useStreamedContent(MAIN_CONTENT, 2500)

  return (
    <div className={`relative min-h-screen overflow-hidden flex flex-col ${isDarkMode ? "dark" : ""}`} style={{ backgroundColor: isDarkMode ? "#000000" : "#EDF2FF" }}>
      {/* Announcement Banner */}
      <div className="w-full text-center py-2.5 px-4 z-20" style={{ backgroundColor: isDarkMode ? "#000000" : "#EDF2FF" }}>
        <span className="font-code text-[11px] tracking-wide" style={{ color: "#3366FF" }}>
          <AnimatedMarkdown 
            content={BANNER_TEXT}
            animation="fadeIn"
            animationDuration="0.05s"
            animationTimingFunction="ease-out"
            sep="char"
          />
        </span>
      </div>
      
      <div className="flex flex-col lg:flex-row flex-1">
        <div
          className="w-full lg:w-1/2 p-8 lg:p-12 font-mono relative z-10 flex flex-col min-h-[calc(100vh-36px)] lg:min-h-0 text-foreground"
          style={{ backgroundColor: isDarkMode ? "#000000" : "#EDF2FF" }}
        >
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-8 right-8 z-10"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </Button>

          {showContact ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <JunoLogo isDarkMode={isDarkMode} />
              </div>
              <div className="flex-1">
                <ContactForm onClose={() => setShowContact(false)} />
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="mb-12">
                <JunoLogo isDarkMode={isDarkMode} />
              </div>

              {/* Main Content with Streaming Animation */}
              <div className="flex-1 flex flex-col justify-center prose prose-sm dark:prose-invert max-w-md relative">
                {/* Invisible full content to reserve layout space */}
                <div className="invisible" aria-hidden="true">
                  <AnimatedMarkdown content={MAIN_CONTENT} animation={null} sep="word" />
                  <div className="flex gap-8 text-sm mt-8 not-prose">
                    <div><span className="text-2xl font-normal">559K+</span><p className="text-muted-foreground text-xs mt-1">Uses</p></div>
                    <div><span className="text-2xl font-normal">+50%</span><p className="text-muted-foreground text-xs mt-1">on pedagogical benchmarks</p></div>
                  </div>
                </div>
                {/* Visible streamed content overlaid on top */}
                <div className="absolute inset-0">
                  <AnimatedMarkdown
                    content={streamedContent}
                    animation="fadeIn"
                    animationDuration="0.3s"
                    animationTimingFunction="ease-out"
                    sep="diff"
                  />
                  <div className={`flex gap-8 text-sm mt-8 not-prose transition-opacity duration-300 ${streamDone ? "opacity-100" : "opacity-0"}`}>
                    <div>
                      <span className="text-2xl font-normal">559K+</span>
                      <p className="text-muted-foreground text-xs mt-1">Uses</p>
                    </div>
                    <div>
                      <span className="text-2xl font-normal">+50%</span>
                      <p className="text-muted-foreground text-xs mt-1">on pedagogical benchmarks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners Section */}
              <div className="py-8 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Partners</p>
                <PartnerLogos />
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Button
                    variant="link"
                    onClick={() => setShowContact(true)}
                    className="text-sm text-foreground hover:text-muted-foreground p-0 h-auto"
                  >
                    Get in touch
                  </Button>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    {"We're in stealth mode"}
                    <MegaphoneOff size={16} />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:block w-1/2 relative">
          <Dithering
            style={{ height: "100%", width: "100%" }}
            colorBack={isDarkMode ? "#000000" : "#EDF2FF"}
            colorFront={isDarkMode ? "#3366FF" : "#3366FF"}
            shape="cats"
            type="4x4"
            pxSize={3}
            offsetX={0}
            offsetY={0}
            scale={0.8}
            rotation={0}
            speed={0.1}
          />
        </div>
      </div>
    </div>
  )
}
