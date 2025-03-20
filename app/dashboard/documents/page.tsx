"use client"

import { useState } from "react"
import { FileText, FolderOpen, Upload, Download, Search, MoreHorizontal, File, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import DashboardNav from "@/components/dashboard-nav"

// Sample documents data
const documents = [
  {
    id: 1,
    name: "Business Plan.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "March 10, 2025",
    shared: true,
  },
  {
    id: 2,
    name: "Financial Projections.xlsx",
    type: "excel",
    size: "1.8 MB",
    modified: "March 5, 2025",
    shared: false,
  },
  {
    id: 3,
    name: "Marketing Strategy.docx",
    type: "word",
    size: "950 KB",
    modified: "February 28, 2025",
    shared: true,
  },
  {
    id: 4,
    name: "Pitch Deck.pptx",
    type: "powerpoint",
    size: "4.2 MB",
    modified: "February 20, 2025",
    shared: true,
  },
  {
    id: 5,
    name: "Project Timeline.pdf",
    type: "pdf",
    size: "1.1 MB",
    modified: "February 15, 2025",
    shared: false,
  },
]

// Sample folders data
const folders = [
  {
    id: 1,
    name: "Business Documents",
    files: 8,
    modified: "March 12, 2025",
  },
  {
    id: 2,
    name: "Course Materials",
    files: 12,
    modified: "March 1, 2025",
  },
  {
    id: 3,
    name: "Workshop Resources",
    files: 5,
    modified: "February 25, 2025",
  },
]

export default function DashboardDocumentsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardNav activeItem="documents" />

      <div className="flex-1">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
              <p className="text-muted-foreground">Manage your files and resources</p>
            </div>
            <div className="flex gap-2">
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" /> New Folder
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search documents..." className="pl-8" />
              </div>

              <div className="bg-background rounded-lg border p-3 space-y-3">
                <div className="font-medium">Quick Access</div>
                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Recent Documents</span>
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left">
                  <Download className="h-4 w-4 text-green-500" />
                  <span>Downloads</span>
                </button>
                <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left">
                  <FolderOpen className="h-4 w-4 text-yellow-500" />
                  <span>Shared with Me</span>
                </button>
              </div>

              <div className="bg-background rounded-lg border p-3">
                <div className="font-medium mb-3">Storage</div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "65%" }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">6.5 GB</span> of 10 GB used
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <Tabs defaultValue="all" className="space-y-6">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Files</TabsTrigger>
                    <TabsTrigger value="shared">Shared</TabsTrigger>
                    <TabsTrigger value="folders">Folders</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView("grid")}
                      className={view === "grid" ? "bg-muted" : ""}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-grid-2x2"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 12h18" />
                        <path d="M12 3v18" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView("list")}
                      className={view === "list" ? "bg-muted" : ""}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-list"
                      >
                        <line x1="8" x2="21" y1="6" y2="6" />
                        <line x1="8" x2="21" y1="12" y2="12" />
                        <line x1="8" x2="21" y1="18" y2="18" />
                        <line x1="3" x2="3.01" y1="6" y2="6" />
                        <line x1="3" x2="3.01" y1="12" y2="12" />
                        <line x1="3" x2="3.01" y1="18" y2="18" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <TabsContent value="all">
                  {view === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {folders.map((folder) => (
                        <Card key={`folder-${folder.id}`} className="overflow-hidden">
                          <CardContent className="p-0">
                            <button className="w-full p-4 text-left hover:bg-muted/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="bg-muted p-2 rounded-md">
                                  <Folder className="h-8 w-8 text-yellow-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{folder.name}</p>
                                  <p className="text-sm text-muted-foreground">{folder.files} files</p>
                                  <p className="text-xs text-muted-foreground mt-1">Modified {folder.modified}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </button>
                          </CardContent>
                        </Card>
                      ))}

                      {documents.map((document) => (
                        <Card key={`doc-${document.id}`} className="overflow-hidden">
                          <CardContent className="p-0">
                            <button className="w-full p-4 text-left hover:bg-muted/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="bg-muted p-2 rounded-md">
                                  <File className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium truncate">{document.name}</p>
                                    {document.shared && (
                                      <Badge variant="outline" className="text-xs">
                                        Shared
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{document.size}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Modified {document.modified}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Download</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-md p-3 grid grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2">Size</div>
                        <div className="col-span-3">Modified</div>
                        <div className="col-span-1"></div>
                      </div>
                      <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-1">
                          {folders.map((folder) => (
                            <div
                              key={`folder-list-${folder.id}`}
                              className="rounded-md p-3 grid grid-cols-12 items-center hover:bg-muted/50"
                            >
                              <div className="col-span-6 flex items-center gap-3">
                                <Folder className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">{folder.name}</span>
                              </div>
                              <div className="col-span-2 text-sm text-muted-foreground">{folder.files} files</div>
                              <div className="col-span-3 text-sm text-muted-foreground">{folder.modified}</div>
                              <div className="col-span-1 flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}

                          {documents.map((document) => (
                            <div
                              key={`doc-list-${document.id}`}
                              className="rounded-md p-3 grid grid-cols-12 items-center hover:bg-muted/50"
                            >
                              <div className="col-span-6 flex items-center gap-3">
                                <File className="h-5 w-5 text-blue-500" />
                                <div>
                                  <span className="font-medium">{document.name}</span>
                                  {document.shared && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Shared
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="col-span-2 text-sm text-muted-foreground">{document.size}</div>
                              <div className="col-span-3 text-sm text-muted-foreground">{document.modified}</div>
                              <div className="col-span-1 flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Download</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shared">
                  {view === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents
                        .filter((doc) => doc.shared)
                        .map((document) => (
                          <Card key={`shared-${document.id}`} className="overflow-hidden">
                            <CardContent className="p-0">
                              <button className="w-full p-4 text-left hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className="bg-muted p-2 rounded-md">
                                    <File className="h-8 w-8 text-blue-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium truncate">{document.name}</p>
                                      <Badge variant="outline" className="text-xs">
                                        Shared
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{document.size}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Modified {document.modified}</p>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">More</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Open</DropdownMenuItem>
                                      <DropdownMenuItem>Download</DropdownMenuItem>
                                      <DropdownMenuItem>Share</DropdownMenuItem>
                                      <DropdownMenuItem>Rename</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-md p-3 grid grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2">Size</div>
                        <div className="col-span-3">Modified</div>
                        <div className="col-span-1"></div>
                      </div>
                      <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-1">
                          {documents
                            .filter((doc) => doc.shared)
                            .map((document) => (
                              <div
                                key={`shared-list-${document.id}`}
                                className="rounded-md p-3 grid grid-cols-12 items-center hover:bg-muted/50"
                              >
                                <div className="col-span-6 flex items-center gap-3">
                                  <File className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <span className="font-medium">{document.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Shared
                                    </Badge>
                                  </div>
                                </div>
                                <div className="col-span-2 text-sm text-muted-foreground">{document.size}</div>
                                <div className="col-span-3 text-sm text-muted-foreground">{document.modified}</div>
                                <div className="col-span-1 flex justify-end">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">More</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Open</DropdownMenuItem>
                                      <DropdownMenuItem>Download</DropdownMenuItem>
                                      <DropdownMenuItem>Share</DropdownMenuItem>
                                      <DropdownMenuItem>Rename</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="folders">
                  {view === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {folders.map((folder) => (
                        <Card key={`folder-tab-${folder.id}`} className="overflow-hidden">
                          <CardContent className="p-0">
                            <button className="w-full p-4 text-left hover:bg-muted/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="bg-muted p-2 rounded-md">
                                  <Folder className="h-8 w-8 text-yellow-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{folder.name}</p>
                                  <p className="text-sm text-muted-foreground">{folder.files} files</p>
                                  <p className="text-xs text-muted-foreground mt-1">Modified {folder.modified}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-md p-3 grid grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2">Files</div>
                        <div className="col-span-3">Modified</div>
                        <div className="col-span-1"></div>
                      </div>
                      <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-1">
                          {folders.map((folder) => (
                            <div
                              key={`folder-tab-list-${folder.id}`}
                              className="rounded-md p-3 grid grid-cols-12 items-center hover:bg-muted/50"
                            >
                              <div className="col-span-6 flex items-center gap-3">
                                <Folder className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">{folder.name}</span>
                              </div>
                              <div className="col-span-2 text-sm text-muted-foreground">{folder.files} files</div>
                              <div className="col-span-3 text-sm text-muted-foreground">{folder.modified}</div>
                              <div className="col-span-1 flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Open</DropdownMenuItem>
                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

