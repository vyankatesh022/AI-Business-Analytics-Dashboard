"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, GripHorizontal } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ReportBuilderCanvas() {
  const [blocks, setBlocks] = useState<{ id: string; type: string }[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const type = e.dataTransfer.getData("application/reactflow")
    if (type) {
      setBlocks([...blocks, { id: Math.random().toString(36).substring(7), type }])
    }
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  return (
    <div 
      className={`min-h-[800px] rounded-xl border-2 border-dashed transition-colors p-8 bg-background ${
        isDragOver ? "border-primary bg-primary/5" : "border-muted"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {blocks.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center flex-col text-muted-foreground pt-32">
          <div className="mb-4 rounded-full bg-muted p-4">
            <GripHorizontal className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-lg font-medium">Drag and drop blocks here</p>
          <p className="text-sm mt-1">Start building your report by dragging elements from the left panel.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full shadow-md"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2 cursor-move bg-muted/20 border-b">
                    <div className="flex items-center justify-center">
                      <GripHorizontal className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 min-h-[150px] flex items-center justify-center bg-background">
                    {/* Placeholder for actual block renderer */}
                    <div className="text-muted-foreground font-mono text-sm">
                      [{block.type.toUpperCase()} BLOCK RENDERER]
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
