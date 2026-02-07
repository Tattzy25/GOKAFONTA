"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info, Loader2, Download, Sparkles, Share2, Edit, X } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { toast } from "sonner"
import { generateImage } from "./actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const FONT_GALLERY = [
  { name: "Abbey Damn", file: "ABBEY DAMN_Font_Abbey_Dawn_by_loveinhoollywood.png" },
  { name: "Abhinaya", file: "Abhinaya_ABHINAYA Free Version.png" },
  { name: "Ace Records", file: "ACE Records_Ace_Records.png" },
  { name: "Acuentre", file: "Acuentre_Acuentre.png" },
  { name: "Agise", file: "agise_AgiseRujdiRegular.png" },
  { name: "Anger Styles", file: "Anger Styles_AngerStyles.png" },
  { name: "Armagist", file: "Armagist Regular_armagist.png" },
  { name: "Asinges", file: "Asinges Regular_Asinges.png" },
  { name: "Auriga", file: "Auriga_Auriga-BF657ea7a30d095.png" },
  { name: "Auvelamerde", file: "AUVELAMERDE_Auvelamerde.png" },
  { name: "Avalen Rekas", file: "Avalen Rekas_AvalenRekasRegular-ZVZa8.png" },
  { name: "Bangilan", file: "Bangilan_Bangilan.png" },
  { name: "Baroneys", file: "Baroneys_BaroneysTextured.png" },
  { name: "Bemdayni", file: "Bemdayni_bemdayni-e9jgp.png" },
  { name: "Betchers", file: "Betchers_Betchers.png" },
  { name: "Beyond Wonderland", file: "Beyond Wonderland_Beyond Wonderland.png" },
  { name: "Black Saviour", file: "black saviour_Black Savior.png" },
  { name: "Black Skate", file: "Black Skate_Black Skate.png" },
  { name: "Blackburr", file: "Blackburr_Blackburr.png" },
  { name: "Blackcat", file: "Blackcat_TcblackcatRegular-pgZjd.png" },
  { name: "Black Chancery", file: "BlackChancery_BLKCHCRY.png" },
  { name: "Bleeding Cowboys", file: "Bleeding cowboys_Bleeding_Cowboys.png" },
  { name: "Blood of Dracula", file: "Blood of Dracula_Bloodrac.png" },
  { name: "Bristol Maver", file: "Bristol maver_BristolMaverRegular-ow0P0.png" },
  { name: "Brotherhood Script", file: "Brotherhood Script_Brotherhood_Script.png" },
  { name: "Brotherhood", file: "Brotherhood_Brotherhood.png" },
  { name: "Butter Haunted", file: "Butter Haunted_Butter Haunted (1).png" },
  { name: "C.S Bergamot", file: "C.S Bergamot_csbergamot-regular.png" },
  { name: "Chappel Text", file: "Chappel Text_Chappel-Text.png" },
  { name: "Charming", file: "charming_CHARMING.png" },
  { name: "Circus Age", file: "circus age_Circus-Age.png" },
  { name: "Cloister Black", file: "Cloister Black_CloisterBlack.png" },
  { name: "Curseyt", file: "Curseyt_Curseyt-drq1g.png" },
  { name: "Daisuky Fancy", file: "Daisuky Fancy_DaisukyFancy-gxp71.png" },
  { name: "Dark Angeles", file: "Dark Angeles_dark-angels.regular.png" },
  { name: "Death Crow", file: "DEATH CROW_DEATHCROW.png" },
  { name: "Death Devil", file: "DEATH DEVIL_Death_Devil.png" },
  { name: "Diploma", file: "Diploma regular_diploma.png" },
  { name: "Dirt 2 Soulstalker", file: "Dirt 2 soulstalker_dirt2_soulstalker.png" },
  { name: "Distropiax", file: "Distropiax_Distropiax-WpYMA.png" },
  { name: "Etherion", file: "ETHERION_Etherion FREE.png" },
  { name: "Faith", file: "Faith Regular_BelongFaithRegular-nRJJM.png" },
  { name: "Familia", file: "Familia_Familia.png" },
  { name: "Feathergraphy", file: "Feathergraphy_FeathergraphyDecoration-BXYx.png" },
  { name: "Fiolex Mephisto", file: "FIOLEX MEPHISTO_Fiolex_Mephisto.png" },
  { name: "Firwaen", file: "Firwaen_FIRWAENpersonaluse.png" },
  { name: "Forsaken Emperor", file: "ForsakenEmper_Forsaken Emperor.png" },
  { name: "Frankenstein", file: "Frankenstein_FRNKSTNN.png" },
  { name: "Gorillabeer", file: "Gorillabeer Gorillabeerbase_Gorillabeer-Gorillabeerbase.png" },
  { name: "Gothical", file: "gothical_Gothical.png" },
  { name: "Grusskarten Gotisch", file: "Grusskarten Gotisch_GrusskartenGotisch.png" },
  { name: "Hacjiuza", file: "Hacjiuza_Hacjiuza_Dirty.png" },
  { name: "Hathama", file: "Hathama_Hathama-XGVEg.png" },
  { name: "Hostgard", file: "Hostgard_HostgardPersonalUse-JpmZB.png" },
  { name: "Jocker", file: "JOCKER_Jocker Extrude Right.png" },
  { name: "Justify", file: "Justify_Justify.png" },
  { name: "Kingthings", file: "Kingthings_KingthingsSpikeless-lKPZ.png" },
  { name: "Lethal", file: "LETHAL_lethal-injector-regular.png" },
  { name: "Living Stone", file: "living stone_Livingstone.png" },
  { name: "Lordish", file: "Lordish_Lordish-Regular.png" },
  { name: "Markingmate", file: "Markingmate_markingmatepersonaluse-2oo9e.png" },
  { name: "Metal Macabre", file: "Metal macabre_MetalFest.png" },
  { name: "Metal Thorn", file: "Metal Thorn_metalthornregular-0w43g.png" },
  { name: "Monika", file: "Monika_Monika.png" },
  { name: "Monk", file: "MONK_Monk-Gothic.png" },
  { name: "Monolith", file: "Monolith-Regular.png" },
  { name: "Nestcology", file: "NESTCOLOGY_Nestcology.png" },
  { name: "Nortnoh", file: "Nortnoh_NortnohRegular-8MEPA.png" },
  { name: "Old English", file: "old english_OldeEnglish.png" },
  { name: "Perfect Signature", file: "perfect signature_perfect-signature.png" },
  { name: "Rampage Monoline", file: "Rampage Monoline_RampageMonoline-Rounded.png" },
  { name: "Rebute", file: "REBUTE_Rebute.png" },
  { name: "Red Royale", file: "Red Royale_Red Royale.png" },
  { name: "Redsniper", file: "Redsniper_Redsniper.png" },
  { name: "Respective", file: "Respective_Respective_2.0.png" },
  { name: "Retro Signature", file: "Retro Signature_RetroSignature.png" },
  { name: "Rooters", file: "Rooters_Rooters.png" },
  { name: "Scarbes", file: "Scarbes_Scarbes.png" },
  { name: "Shadowed Black", file: "Shadowed Black_Shadowed_Black.png" },
  { name: "Shiny Kage", file: "Shiny kage_Shiny kage.png" },
  { name: "Single Ghost", file: "Single Ghost_SingleGhost regular.png" },
  { name: "Snakefangs", file: "snakefangs_SnakeFangs FREE.png" },
  { name: "Soulside Betrayed", file: "Soulside Betrayed_SoulsideBetrayed-3lazX.png" },
  { name: "Stay Classy", file: "Stay Classy_Stay Classy SLDT.png" },
  { name: "Taylor Gothic", file: "Taylor Gothic_TaylorGothic.png" },
  { name: "The Amazing Spiderman", file: "The Amazing Spiderman_The_Amazing_Spider-Man.png" },
  { name: "The Crow Shadow", file: "The Crow Shadow_TheCrowShadow.png" },
  { name: "The Lastring", file: "The Lastring_TheLastring-DOLZW.png" },
  { name: "Thousand Familia", file: "Thousand familia_Thousand Familia Regular.png" },
  { name: "Throwing Axes", file: "Throwing axes_ThrowingAxes.png" },
  { name: "Unquiet Spirits", file: "UNQUIET SPIRITS_Unquiet_Spirits.png" },
  { name: "Wilson Wells", file: "Wilson wells_Wilson wells.png" },
  { name: "Wishmf", file: "Wishmf_WishMF.png" },
  { name: "Zepplines", file: "Zepplines_Zepplines.png" },
  { name: "Zoombie Holocaust", file: "Zoombie Holocaust_Zombie_Holocaust.png" },
]

function LabelWithTooltip({ id, label, tooltip }: { id?: string, label: string, tooltip: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-xs text-sm">
          <p>{tooltip}</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}


export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  
  // Share State
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareFile, setShareFile] = useState<File | null>(null)
  const [shareUrl, setShareUrl] = useState("")

  // Form State
  const [prompt, setPrompt] = useState("")
  const [fontPreviewOpen, setFontPreviewOpen] = useState(false)
  const [selectedFont, setSelectedFont] = useState<typeof FONT_GALLERY[0] | null>(null)
  const [highlightedFont, setHighlightedFont] = useState<string | null>(null)

  // Iframe height management
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const reportHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight
        window.parent.postMessage({ type: 'setHeight', height }, '*')
      }
    }

    const observer = new ResizeObserver(reportHeight)
    if (containerRef.current) observer.observe(containerRef.current)
    
    // Also report on image load
    window.addEventListener('load', reportHeight)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('load', reportHeight)
    }
  }, [generatedImages, isLoading])

  const handleGenerate = async () => {
    if (isLoading) return // Prevent double clicks
    
    if (prompt.trim().length > 20) {
      toast.error("Maximum 20 characters allowed")
      return
    }

    if (!prompt.trim()) {
      toast.error("Please enter a message to generate an image")
      return
    }

    setIsLoading(true)
    setGeneratedImages([])

    const formData = new FormData()
    const finalPrompt = highlightedFont 
      ? `${prompt}, ${highlightedFont} font style`
      : prompt
    formData.append("prompt", finalPrompt)

    const result = await generateImage(formData)

    if (result.success && result.output) {
      setGeneratedImages(Array.isArray(result.output) ? (result.output as string[]) : [result.output as string])
    } else {
      console.error(result.error)
      toast.error(result.error || "Failed to generate image. Please try again.")
    }
    setIsLoading(false)
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const filename = `generated-image-${index + 1}.webp`
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&filename=${filename}`)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error('Download failed:', error)
      toast.error("Download failed. Please try again.")
    }
  }

  const handleShare = async (url: string, index: number) => {
    const filename = `generated-image-${index + 1}.webp`
    setShareUrl(url)
    
      if (navigator.canShare && navigator.canShare({ files: [new File([], 'test.png')] })) {
        toast.info("Preparing image for sharing...")
        
        try {
          const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&filename=${filename}`)
          if (response.ok) {
            const blob = await response.blob()
            const file = new File([blob], filename, { type: blob.type })
            setShareFile(file)
            setShareDialogOpen(true)
            return
          }
        } catch (error) {
          console.warn("File preparation failed", error)
        }
      }

    // Fallback to Link Sharing immediately if file sharing isn't supported or failed
    try {
      if (navigator.share) {
        await navigator.share({
        title: 'TaTTTy Fonts AI Generation',
        text: 'Check out this image I generated with TaTTTy Fonts AI!',
        url: url
      })
        toast.success("Shared link successfully")
        return
      }
    } catch (error) {
      console.warn("Link sharing failed", error)
    }

    // Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(url)
      toast.info("Sharing failed, link copied to clipboard instead!")
    } catch {
      toast.error("Failed to share. Try downloading instead.")
    }
  }

  const executeShare = async () => {
    if (!shareFile) return
    
    try {
      await navigator.share({
        title: 'TaTTTy Fonts AI Generation',
        text: 'Check out this image I generated with TaTTTy Fonts AI!',
        files: [shareFile]
      })
      toast.success("Shared image successfully")
      setShareDialogOpen(false)
    } catch (error) {
      console.warn("Share execution failed", error)
      
      // If user cancelled, just close dialog
      if (error instanceof Error && error.name === 'AbortError') {
        setShareDialogOpen(false)
        return
      }

      // Fallback to link sharing
      if (shareUrl) {
        try {
          await navigator.share({
            title: 'TaTTTy Fonts AI Generation',
            text: 'Check out this image I generated with TaTTTy Fonts AI!',
            url: shareUrl
          })
          setShareDialogOpen(false)
          return
        } catch {
           // ignore
        }
      }
      
      toast.error("Sharing failed. Try downloading instead.")
      setShareDialogOpen(false)
    }
  }

  const slides = generatedImages.map((src) => ({
    src,
    width: 1024,
    height: 1024,
  }))

  return (
    <div className="flex flex-col w-full" ref={containerRef}>
      <div className="container mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-8 sm:space-y-12 max-w-6xl">
        
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Design Your Next Tattoo
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please be descriptive with your <span className="text-foreground font-medium">Message</span>. Mention the <span className="text-foreground font-medium">style</span> and <span className="text-foreground font-medium">colors</span> you want—for example: 
            <span className="italic text-foreground"> &quot;traditional style, bold lines, black and grey&quot;</span> or 
            <span className="italic text-foreground"> &quot;realistic portrait, vibrant colors, fine detail&quot;</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="h-full border-2 rounded-lg sm:rounded-2xl">
          <CardContent className="space-y-4 p-2 sm:p-4 sm:pt-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <LabelWithTooltip
                  id="prompt"
                  label="Message"
                  tooltip="Enter a word, name, or short message to generate (Maximum 20 characters)."
                />
              </div>
              <Input
                id="prompt"
                placeholder="Enter your message, name, or word..."
                className="h-12 text-lg"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={20}
              />
              {highlightedFont && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    {highlightedFont}
                    <button 
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => setHighlightedFont(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <LabelWithTooltip
                  id="fonts"
                  label="Select a Font Style"
                  tooltip="Click a font to add it to your message."
                />
                <div className="relative w-full -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide sm:mx-0 sm:px-0">
                  <div className="grid grid-rows-2 grid-flow-col gap-2 sm:gap-6 min-w-max px-1 pt-2">
                    {FONT_GALLERY.map((font, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col gap-1 w-48 sm:w-72 cursor-pointer group"
                        onClick={() => {
                          setHighlightedFont(font.name)
                          toast.info(`Selected ${font.name} font style`)
                        }}
                      >
                        <div className={cn(
                          "aspect-video overflow-hidden rounded-lg border-2 transition-all group-hover:border-primary group-hover:shadow-lg bg-white/5 relative",
                          highlightedFont === font.name ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted"
                        )}>
                          <img 
                            src={`/font-gal/${font.file}`} 
                            alt={font.name}
                            className="h-full w-full object-contain p-0.5"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full shadow-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(idx);
                                setFontPreviewOpen(true);
                                setSelectedFont(font);
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-sm font-semibold text-center truncate px-1">
                          {font.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          className={cn(
            "w-full max-w-md text-3xl py-8 h-auto transition-transform active:scale-95",
            isLoading && "opacity-50 cursor-not-allowed active:scale-100"
          )}
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-8 w-8 animate-spin" />
              CREATING...
            </>
          ) : (
            <>
              <Sparkles className="mr-3 h-8 w-8" />
              CREATE
              <Sparkles className="ml-3 h-8 w-8" />
            </>
          )}
        </Button>
      </div>

      <Separator />
      
      <div className="flex flex-col items-center pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Creating your masterpiece...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 w-full">
            {generatedImages.map((src, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div 
                  className="relative rounded-xl overflow-hidden flex items-center justify-center w-full border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer aspect-square bg-muted/20 sm:aspect-[4/5]"
                  onClick={() => {
                    setLightboxIndex(i)
                    setLightboxOpen(true)
                  }}
                >
                  <img 
                    src={src} 
                    alt={`Generated image ${i + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 h-9 rounded-lg"
                    onClick={() => handleDownload(src, i)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 h-9 rounded-lg"
                    onClick={() => handleShare(src, i)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  {/* Edit feature removed for now as workspace state is not defined */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />

      <Dialog open={fontPreviewOpen} onOpenChange={setFontPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFont?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted/20">
            {selectedFont && (
              <img 
                src={`/font-gal/${selectedFont.file}`} 
                alt={selectedFont.name}
                className="w-full h-full object-contain p-4"
              />
            )}
          </div>
          <DialogFooter>
            <Button 
              className="w-full"
              onClick={() => {
                if (selectedFont) {
                  setHighlightedFont(selectedFont.name)
                  toast.info(`Selected ${selectedFont.name} font style`)
                }
                setFontPreviewOpen(false)
              }}
            >
              Select this font
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ready to Share</DialogTitle>
            <DialogDescription>
              Your image has been prepared. Click the button below to share it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={executeShare}>Share Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}