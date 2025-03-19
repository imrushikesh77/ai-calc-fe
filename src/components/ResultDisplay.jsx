import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Copy, Check } from "lucide-react"

function ResultDisplay({ result }) {
  const [viewMode, setViewMode] = useState("formatted")
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState({})
  // console.log(result)
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  if (!result) {
    return <div className="text-center p-4">No results to display</div>
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
  }

  const toggleExpand = (key) => {
    setIsExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const replacements = {
    '∫': '∫',
    '^2': '²',
    '^3': '³',
    '/': '÷',
    '*': '×',
    'pi': 'π',
    'sqrt': '√',
    'log': 'log',
    'ln': 'ln'
  }

  const renderFormatted = () => {
    // Handle different possible response structures
    if (result.steps && Array.isArray(result.steps)) {
      return (
        <div className="space-y-4">
          {result.title && <h3 className="text-xl font-bold">Topic: {result.title}</h3>}
          {result.question && <h4 className="text-xl font"><span className="text-xl font-bold">Question:</span> {result.question}</h4>}
          {result.description && <p className="text-muted-foreground"><span className="text-xl font-bold">Description:</span> {result.description}</p>}

          <div className="space-y-4">
            {result.steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium mb-2">Step {index + 1}</h4>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (result.explanation) {
      return (
        <div className="space-y-4">
          {result.title && <h3 className="text-xl font-bold">{result.title}</h3>}
          <div className="prose max-w-none dark:prose-invert">
            <p>{result.explanation}</p>
          </div>
        </div>
      )
    } else {
      // Fallback for unknown structure
      return (
        <div className="space-y-4">
          {Object.entries(result).map(([key, value]) => {
            const isExpandable = typeof value === "object" && value !== null && Object.keys(value).length > 3
            const shouldTruncate = isExpandable && !isExpanded[key]

            return (
              <div key={key} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium capitalize">{key.replace(/_/g, " ")}</h4>
                {typeof value === "string" ? (
                  <p>{value}</p>
                ) : Array.isArray(value) ? (
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {value.map((item, i) => (
                      <li key={i}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2">
                    <pre className="bg-muted p-2 rounded text-sm overflow-auto max-h-[300px]">
                      {shouldTruncate
                        ? JSON.stringify(value, null, 2).substring(0, 200) + "..."
                        : JSON.stringify(value, null, 2)}
                    </pre>
                    {isExpandable && (
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(key)} className="mt-2">
                        {isExpanded[key] ? "Show less" : "Show more"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    }
  }

  const renderRaw = () => {
    return (
      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[500px]">
          {JSON.stringify(result, null, 2)}
        </pre>
        <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="formatted">Formatted</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="formatted">{renderFormatted()}</TabsContent>
          <TabsContent value="raw">{renderRaw()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ResultDisplay

