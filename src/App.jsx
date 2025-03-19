import { useState, useEffect } from "react"
import DrawingCanvas from "./components/DrawingCanvas"
import ResultDisplay from "./components/ResultDisplay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Moon, Sun } from "lucide-react"

function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("draw")
  const [darkMode, setDarkMode] = useState(false)

  // Initialize dark mode based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSubmit = async (imageData) => {
    setIsLoading(true)
    try {
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:6277/calculate"
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from server")
      }

      const data = await response.json()
      setResult(data)
      setActiveTab("result")
    } catch (error) {
      console.error("Error submitting drawing:", error)
      alert("Failed to process your drawing. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Slate</h1>
          {/* <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <p className="text-center mb-8 text-muted-foreground">
          Draw your problem on the canvas and get step-by-step solutions from Gen AI
        </p>

        <div className="w-full max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="result" disabled={!result}>
                Solution
              </TabsTrigger>
            </TabsList>
            <TabsContent value="draw">
              <Card>
                <CardHeader>
                  <CardTitle>Draw Your Problem</CardTitle>
                  <CardDescription>
                    Use the pen tools to draw your problem. Click submit when you're ready.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DrawingCanvas onSubmit={handleSubmit} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="result">
              <Card>
                <CardHeader>
                  <CardTitle>Solution</CardTitle>
                  <CardDescription>Here's the solution to your problem</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultDisplay result={result.result} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Smart Slate © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

export default App

