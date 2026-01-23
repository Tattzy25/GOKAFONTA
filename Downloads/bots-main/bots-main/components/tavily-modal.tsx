"use client"

import { useState } from "react"
import { tavilySearch } from '@/components/Tavily/tavily_search'
import { tavilyExtract } from '@/components/Tavily/tavily_extract'
import { tavilyMap } from '@/components/Tavily/tavily_map'
import { tavilyCrawl } from '@/components/Tavily/tavily_crawl'
import { tavilyResearch } from '@/components/Tavily/tavily_research'
import { CommandDialog } from "@/components/ui/command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TavilyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tool: string, params: Record<string, unknown>) => void
}

interface SearchParams {
  query: string
  search_depth: 'basic' | 'advanced' | 'fast' | 'ultra-fast'
  topic: 'general' | 'news'
  days?: number
  time_range?: string
  start_date?: string
  end_date?: string
  max_results: number
  include_images: boolean
  include_image_descriptions: boolean
  include_raw_content: boolean
  include_domains: string[]
  exclude_domains: string[]
  country?: string
  include_favicon: boolean
}

interface ExtractParams {
  urls: string[]
  extract_depth: 'basic' | 'advanced'
  include_images: boolean
  format: 'markdown' | 'text'
  include_favicon: boolean
  query?: string
}

interface MapParams {
  url: string
  max_depth: number
  max_breadth: number
  limit: number
  instructions?: string
  select_paths: string[]
  select_domains: string[]
  allow_external: boolean
}

interface CrawlParams {
  url: string
  max_depth: number
  max_breadth: number
  limit: number
  instructions?: string
  select_paths: string[]
  select_domains: string[]
  allow_external: boolean
  extract_depth: 'basic' | 'advanced'
  format: 'markdown' | 'text'
  include_favicon: boolean
}

export function TavilyModal({ open, onOpenChange, onSubmit }: TavilyModalProps) {
  const [activeTab, setActiveTab] = useState("search")

  // Search state
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    search_depth: "basic",
    topic: "general",
    max_results: 10,
    include_images: false,
    include_image_descriptions: false,
    include_raw_content: false,
    include_domains: [],
    exclude_domains: [],
    include_favicon: false
  })

  // Extract state
  const [extractParams, setExtractParams] = useState<ExtractParams>({
    urls: [],
    extract_depth: "basic",
    include_images: false,
    format: "markdown",
    include_favicon: false
  })

  // Map state
  const [mapParams, setMapParams] = useState<MapParams>({
    url: "",
    max_depth: 1,
    max_breadth: 20,
    limit: 50,
    select_paths: [],
    select_domains: [],
    allow_external: true
  })

  // Crawl state
  const [crawlParams, setCrawlParams] = useState<CrawlParams>({
    url: "",
    max_depth: 1,
    max_breadth: 20,
    limit: 50,
    select_paths: [],
    select_domains: [],
    allow_external: true,
    extract_depth: "basic",
    format: "markdown",
    include_favicon: false
  })

  // Research state
  const [researchQuery, setResearchQuery] = useState("")
  const [researchMode, setResearchMode] = useState<"mini" | "pro">("mini")

  const handleSubmit = async () => {
    onOpenChange(false)
    try {
      let result: unknown
      switch (activeTab) {
        case 'search':
          if (!searchParams.query.trim()) throw new Error('Empty search query')
          result = await tavilySearch(searchParams)
          break
        case 'extract':
          if (!extractParams.urls.length) throw new Error('No URLs provided')
          result = await tavilyExtract(extractParams)
          break
        case 'map':
          if (!mapParams.url.trim()) throw new Error('No URL provided')
          result = await tavilyMap(mapParams)
          break
        case 'crawl':
          if (!crawlParams.url.trim()) throw new Error('No URL provided')
          result = await tavilyCrawl(crawlParams)
          break
        case 'research':
          if (!researchQuery.trim()) throw new Error('Empty research query')
          result = await tavilyResearch({ query: researchQuery, mode: researchMode })
          break
        default:
          throw new Error(`Unknown active tab: ${activeTab}`)
      }

      const toolResult = {
        role: 'assistant' as const,
        content: `Tavily ${activeTab} results`,
        parts: [
          {
            type: 'tool-result',
            tool: `tavily-${activeTab}`,
            output: result,
            input:
              activeTab === 'research'
                ? { query: researchQuery, mode: researchMode }
                : activeTab === 'search'
                ? searchParams
                : activeTab === 'extract'
                ? extractParams
                : activeTab === 'map'
                ? mapParams
                : crawlParams,
          },
        ],
        id: `tavily-${Date.now()}`,
        timestamp: new Date(),
      }

      onSubmit(`tavily-${activeTab}`, toolResult)
    } catch (err) {
      console.error('Tavily modal execution error', err)
      const errorResult = {
        role: 'assistant' as const,
        content: 'Tavily error',
        parts: [
          {
            type: 'tool-result',
            tool: `tavily-${activeTab}`,
            errorText: String(err),
            input:
              activeTab === 'research'
                ? { query: researchQuery, mode: researchMode }
                : activeTab === 'search'
                ? searchParams
                : activeTab === 'extract'
                ? extractParams
                : activeTab === 'map'
                ? mapParams
                : crawlParams,
          },
        ],
        id: `tavily-error-${Date.now()}`,
        timestamp: new Date(),
      }

      onSubmit(`tavily-${activeTab}`, errorResult)
    }
  }

  const addUrl = (urls: string[], setUrls: (urls: string[]) => void, url: string) => {
    if (url.trim() && !urls.includes(url.trim())) {
      setUrls([...urls, url.trim()])
    }
  }

  const removeUrl = (urls: string[], setUrls: (urls: string[]) => void, url: string) => {
    setUrls(urls.filter(u => u !== url))
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Tavily Search" description="Choose a search tool and configure parameters">
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="crawl">Crawl</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>


                {/* Search Tab */}
                <TabsContent value="search" className="tavily-tabs-content">
                <div className="tavily-form-group">
                  <label htmlFor="search-query" className="tavily-label">Search Query *</label>
                  <Input
                  id="search-query"
                  placeholder="Enter your search query..."
                  value={searchParams.query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchParams({...searchParams, query: e.target.value})}
                  />
                </div>

                <div className="tavily-grid-2">
                  <div className="tavily-form-group">
                  <label htmlFor="search-depth" className="tavily-label">Search Depth</label>
                  <Select value={searchParams.search_depth} onValueChange={(value: SearchParams['search_depth']) => setSearchParams({...searchParams, search_depth: value})}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="ultra-fast">Ultra Fast</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div className="tavily-form-group">
                  <label htmlFor="topic" className="tavily-label">Topic</label>
                  <Select value={searchParams.topic} onValueChange={(value: SearchParams['topic']) => setSearchParams({...searchParams, topic: value})}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>

                {searchParams.topic === "news" && (
                  <div className="tavily-form-group">
                  <label htmlFor="days" className="tavily-label">Days Back</label>
                  <Input
                    id="days"
                    type="number"
                    placeholder="3"
                    value={searchParams.days || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchParams({...searchParams, days: Number.parseInt(e.target.value) || undefined})}
                  />
                  </div>
                )}

                <div className="tavily-grid-2">
                  <div className="tavily-form-group">
                  <label htmlFor="max-results" className="tavily-label">Max Results</label>
                  <Input
                    id="max-results"
                    type="number"
                    value={searchParams.max_results}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchParams({...searchParams, max_results: Number.parseInt(e.target.value)})}
                  />
                  </div>

                  <div className="tavily-form-group">
                  <label htmlFor="country" className="tavily-label">Country</label>
                  <Input
                    id="country"
                    placeholder="e.g., united states"
                    value={searchParams.country || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchParams({...searchParams, country: e.target.value})}
                  />
                  </div>
                </div>

                <div className="tavily-toggle-group">
                  <div className="tavily-toggle-item">
                  <Switch
                    id="include-images"
                    checked={searchParams.include_images}
                    onCheckedChange={(checked: boolean) => setSearchParams({...searchParams, include_images: checked})}
                  />
                  <label htmlFor="include-images" className="tavily-toggle-label">Include Images</label>
                  </div>

                  <div className="tavily-toggle-item">
                  <Switch
                    id="include-raw-content"
                    checked={searchParams.include_raw_content}
                    onCheckedChange={(checked: boolean) => setSearchParams({...searchParams, include_raw_content: checked})}
                  />
                  <label htmlFor="include-raw-content" className="tavily-toggle-label">Include Raw Content</label>
                  </div>

                  <div className="tavily-toggle-item">
                  <Switch
                    id="include-favicon"
                    checked={searchParams.include_favicon}
                    onCheckedChange={(checked: boolean) => setSearchParams({...searchParams, include_favicon: checked})}
                  />
                  <label htmlFor="include-favicon" className="tavily-toggle-label">Include Favicon</label>
                  </div>
                </div>
                </TabsContent>

                {/* Extract Tab */}
                <TabsContent value="extract" className="tavily-tabs-content">
                <div className="tavily-form-group">
                  <label htmlFor="extract-urls" className="tavily-label">URLs *</label>
                  <div className="tavily-input-row">
                  <Input
                    id="extract-urls"
                    placeholder="https://"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement
                      addUrl(extractParams.urls, (urls) => setExtractParams({...extractParams, urls}), target.value)
                      target.value = ''
                    }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addUrl(extractParams.urls, (urls) => setExtractParams({...extractParams, urls}), input.value)
                    input.value = ''
                    }}
                  >
                    Add
                  </Button>
                  </div>
                  <div className="tavily-badges">
                  {extractParams.urls.map((url) => (
                    <Badge key={url} variant="secondary" className="tavily-badge">
                    {url}
                    <X
                      className="tavily-badge-remove"
                      onClick={() => removeUrl(extractParams.urls, (urls) => setExtractParams({...extractParams, urls}), url)}
                    />
                    </Badge>
                  ))}
                  </div>
                </div>

                <div className="tavily-grid-2">
                  <div className="tavily-form-group">
                  <label htmlFor="extract-depth" className="tavily-label">Extract Depth</label>
                  <Select value={extractParams.extract_depth} onValueChange={(value: ExtractParams['extract_depth']) => setExtractParams({...extractParams, extract_depth: value})}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div className="tavily-form-group">
                  <label htmlFor="format" className="tavily-label">Format</label>
                  <Select value={extractParams.format} onValueChange={(value: ExtractParams['format']) => setExtractParams({...extractParams, format: value})}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>

            <div className="space-y-2">
              <label htmlFor="extract-query" className="text-sm font-medium">Query (for reranking)</label>
              <Input
                id="extract-query"
                placeholder="Optional query for content relevance..."
                value={extractParams.query || ""}
                onChange={(e) => setExtractParams({...extractParams, query: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="extract-include-images"
                checked={extractParams.include_images}
                onCheckedChange={(checked: boolean) => setExtractParams({...extractParams, include_images: checked})}
              />
              <label htmlFor="extract-include-images" className="text-sm">Include Images</label>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="map-url" className="text-sm font-medium">URL *</label>
              <Input
                id="map-url"
                placeholder="https://"
                value={mapParams.url}
                onChange={(e) => setMapParams({...mapParams, url: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="map-depth" className="text-sm font-medium">Max Depth</label>
                <Input
                  id="map-depth"
                  type="number"
                  value={mapParams.max_depth}
                  onChange={(e) => setMapParams({...mapParams, max_depth: parseInt(e.target.value)})}
                />
              </div>

<Input
  id="map-breadth"
  type="number"
  value={mapParams.max_breadth}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMapParams({...mapParams, max_breadth: Number.parseInt(e.target.value)})}
/>

              <div className="space-y-2">
                <label htmlFor="map-limit" className="text-sm font-medium">Limit</label>
                <Input
                  id="map-limit"
                  type="number"
                  value={mapParams.limit}
                  onChange={(e) => setMapParams({...mapParams, limit: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="map-instructions" className="text-sm font-medium">Instructions</label>
              <Textarea
                id="map-instructions"
                placeholder="Optional instructions for mapping..."
                value={mapParams.instructions || ""}
                onChange={(e) => setMapParams({...mapParams, instructions: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="map-allow-external"
                checked={mapParams.allow_external}
                onCheckedChange={(checked: boolean) => setMapParams({...mapParams, allow_external: checked})}
              />
              <label htmlFor="map-allow-external" className="text-sm">Allow External Links</label>
            </div>
          </TabsContent>

          {/* Crawl Tab */}
          <TabsContent value="crawl" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="crawl-url" className="text-sm font-medium">URL *</label>
              <Input
                id="crawl-url"
                placeholder="https://"
                value={crawlParams.url}
                onChange={(e) => setCrawlParams({...crawlParams, url: e.target.value})}
              />
            </div>
            <div className="form-grid-3">
              <div className="form-group">
              <label htmlFor="crawl-depth" className="form-label">Max Depth</label>
              <Input
                id="crawl-depth"
                type="number"
                value={crawlParams.max_depth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrawlParams({...crawlParams, max_depth: Number.parseInt(e.target.value)})}
              />
              </div>

              <div className="form-group">
              <label htmlFor="crawl-breadth" className="form-label">Max Breadth</label>
              <Input
                id="crawl-breadth"
                type="number"
                value={crawlParams.max_breadth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrawlParams({...crawlParams, max_breadth: Number.parseInt(e.target.value)})}
              />
              </div>

              <div className="form-group">
              <label htmlFor="crawl-limit" className="form-label">Limit</label>
              <Input
                id="crawl-limit"
                type="number"
                value={crawlParams.limit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrawlParams({...crawlParams, limit: Number.parseInt(e.target.value)})}
              />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="crawl-instructions" className="form-label">Instructions</label>
              <Textarea
              id="crawl-instructions"
              placeholder="Optional instructions for crawling..."
              value={crawlParams.instructions || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCrawlParams({...crawlParams, instructions: e.target.value})}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
              <label htmlFor="crawl-extract-depth" className="form-label">Extract Depth</label>
              <Select value={crawlParams.extract_depth} onValueChange={(value: CrawlParams['extract_depth']) => setCrawlParams({...crawlParams, extract_depth: value})}>
                <SelectTrigger>
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              </div>

              <div className="form-group">
              <label htmlFor="crawl-format" className="form-label">Format</label>
              <Select value={crawlParams.format} onValueChange={(value: CrawlParams['format']) => setCrawlParams({...crawlParams, format: value})}>
                <SelectTrigger>
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

            <div className="form-radio-group">
              <div className="form-radio-item">
              <Switch
                id="crawl-allow-external"
                checked={crawlParams.allow_external}
                onCheckedChange={(checked: boolean) => setCrawlParams({...crawlParams, allow_external: checked})}
              />
              <label htmlFor="crawl-allow-external" className="form-label-inline">Allow External Links</label>
              </div>
            </div>
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research" className="mt-4">
            <div className="form-group">
              <label htmlFor="research-query" className="form-label">Research Query *</label>
              <Textarea
              id="research-query"
              placeholder="Describe your research needs..."
              value={researchQuery}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResearchQuery(e.target.value)}
              rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Research Mode</label>
              <div className="form-radio-group">
              <div className="form-radio-item">
                <input
                type="radio"
                id="mini-mode"
                name="research-mode"
                checked={researchMode === "mini"}
                onChange={() => setResearchMode("mini")}
                />
                <label htmlFor="mini-mode" className="form-label-inline">Mini</label>
              </div>
              <div className="form-radio-item">
                <input
                type="radio"
                id="pro-mode"
                name="research-mode"
                checked={researchMode === "pro"}
                onChange={() => setResearchMode("pro")}
                />
                <label htmlFor="pro-mode" className="form-label-inline">Pro</label>
              </div>
              </div>
            </div>
            </TabsContent>
          </Tabs>

          <div className="form-actions">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
            </Button>
            <Button onClick={handleSubmit}>
            Execute {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          </div>
          </div>
        </CommandDialog>
        )
      }
