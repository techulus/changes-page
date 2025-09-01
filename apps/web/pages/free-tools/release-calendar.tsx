import { CalendarIcon, RefreshIcon, ViewGridIcon, ViewListIcon, PresentationChartLineIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import {
  createToastWrapper,
  notifyError,
  notifySuccess,
} from "../../components/core/toast.component";
import FooterComponent from "../../components/layout/footer.component";
import MarketingHeaderComponent from "../../components/marketing/marketing-header.component";
import usePrefersColorScheme from "../../utils/hooks/usePrefersColorScheme";

interface Release {
  id: string;
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "patch" | "hotfix";
  status: "planned" | "in-progress" | "released" | "delayed";
  description?: string;
}

type ViewMode = "timeline" | "calendar";

export default function ReleaseCalendar({
  title,
  description,
  keywords,
  canonicalUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = usePrefersColorScheme();

  // State
  const [releases, setReleases] = useState<Release[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedReleases = localStorage.getItem('release-calendar-data');
        if (savedReleases) {
          setReleases(JSON.parse(savedReleases));
        }
      } catch (error) {
        console.error('Failed to load releases from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever releases change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('release-calendar-data', JSON.stringify(releases));
      } catch (error) {
        console.error('Failed to save releases to localStorage:', error);
      }
    }
  }, [releases]);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    version: "",
    date: "",
    title: "",
    type: "minor" as Release["type"],
    status: "planned" as Release["status"],
    description: "",
  });


  // Generate unique ID for releases
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  // Add or update release
  const handleSaveRelease = useCallback(() => {
    if (!formData.version.trim() || !formData.date.trim() || !formData.title.trim()) {
      notifyError("Please fill in version, date, and title fields");
      return;
    }

    const releaseData: Release = {
      id: editingRelease?.id || generateId(),
      version: formData.version.trim(),
      date: formData.date,
      title: formData.title.trim(),
      type: formData.type,
      status: formData.status,
      description: formData.description.trim(),
    };

    if (editingRelease) {
      setReleases(prev => prev.map(r => r.id === editingRelease.id ? releaseData : r));
      notifySuccess("Release updated successfully");
    } else {
      setReleases(prev => [...prev, releaseData]);
      notifySuccess("Release added successfully");
    }

    // Reset form
    setFormData({
      version: "",
      date: "",
      title: "",
      type: "minor",
      status: "planned",
      description: "",
    });
    setShowAddForm(false);
    setEditingRelease(null);
  }, [formData, editingRelease, generateId]);

  // Edit release
  const handleEditRelease = useCallback((release: Release) => {
    setFormData({
      version: release.version,
      date: release.date,
      title: release.title,
      type: release.type,
      status: release.status,
      description: release.description || "",
    });
    setEditingRelease(release);
    setShowAddForm(true);
  }, []);

  // Delete release
  const handleDeleteRelease = useCallback((id: string) => {
    setReleases(prev => prev.filter(r => r.id !== id));
    notifySuccess("Release deleted successfully");
  }, []);

  // Reset all data
  const resetData = useCallback(() => {
    setReleases([]);
    setFormData({
      version: "",
      date: "",
      title: "",
      type: "minor",
      status: "planned",
      description: "",
    });
    setShowAddForm(false);
    setEditingRelease(null);
    setPresentationMode(false);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('release-calendar-data');
    }
    notifySuccess("All data cleared");
  }, []);

  // Toggle presentation mode
  const togglePresentationMode = useCallback(() => {
    setPresentationMode(prev => !prev);
    if (!presentationMode) {
      // Hide forms when entering presentation mode
      setShowAddForm(false);
      setEditingRelease(null);
    }
  }, [presentationMode]);

  // Exit presentation mode with Escape key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && presentationMode) {
        setPresentationMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode]);

  // Generate sample data
  const generateSampleData = useCallback(() => {
    const today = new Date();
    const sampleReleases: Release[] = [
      {
        id: generateId(),
        version: "2.1.0",
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "New Dashboard Features",
        type: "minor",
        status: "planned",
        description: "Enhanced analytics dashboard with real-time metrics"
      },
      {
        id: generateId(),
        version: "2.0.1",
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Bug Fixes",
        type: "patch",
        status: "released",
        description: "Fixed authentication issues and improved performance"
      },
      {
        id: generateId(),
        version: "2.2.0",
        date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "API v3 Launch",
        type: "major",
        status: "in-progress",
        description: "Complete API overhaul with breaking changes"
      },
      {
        id: generateId(),
        version: "2.1.1",
        date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Security Patch",
        type: "hotfix",
        status: "planned",
        description: "Critical security vulnerability fix"
      }
    ];
    setReleases(sampleReleases);
    notifySuccess("Sample data loaded");
  }, [generateId]);



  // Sort releases by date
  const sortedReleases = [...releases].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get release type styles and emojis
  const getReleaseTypeStyles = (type: Release["type"]) => {
    switch (type) {
      case "major": return "bg-red-600 text-white font-semibold";
      case "minor": return "bg-blue-600 text-white font-semibold";
      case "patch": return "bg-green-600 text-white font-semibold";
      case "hotfix": return "bg-orange-600 text-white font-semibold";
      default: return "bg-gray-600 text-white font-semibold";
    }
  };

  const getReleaseTypeEmoji = (type: Release["type"]) => {
    switch (type) {
      case "major": return "🚀";
      case "minor": return "✨";
      case "patch": return "🔧";
      case "hotfix": return "🚨";
      default: return "📦";
    }
  };

  // Get status styles and emojis
  const getStatusStyles = (status: Release["status"]) => {
    switch (status) {
      case "planned": return "bg-gray-700 text-white border-gray-600";
      case "in-progress": return "bg-yellow-600 text-white border-yellow-500";
      case "released": return "bg-green-600 text-white border-green-500";
      case "delayed": return "bg-red-600 text-white border-red-500";
      default: return "bg-gray-700 text-white border-gray-600";
    }
  };

  const getStatusEmoji = (status: Release["status"]) => {
    switch (status) {
      case "planned": return "📅";
      case "in-progress": return "⚡";
      case "released": return "✅";
      case "delayed": return "⏰";
      default: return "📋";
    }
  };

  if (presentationMode) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 overflow-auto">
        <Head>
          <title>{title}</title>
        </Head>
        {createToastWrapper(theme)}
        
        {/* Presentation Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-white">Release Timeline - Presentation Mode</h1>
              <p className="text-gray-400 text-sm">Press ESC to exit • Use view toggle to switch between timeline and calendar</p>
            </div>
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex rounded-md bg-white/5" role="group">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={classNames(
                    "px-4 py-2 text-sm font-medium rounded-l-md",
                    viewMode === "timeline"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <ViewListIcon className="w-4 h-4 mr-1 inline" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={classNames(
                    "px-4 py-2 text-sm font-medium rounded-r-md",
                    viewMode === "calendar"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <ViewGridIcon className="w-4 h-4 mr-1 inline" />
                  Calendar
                </button>
              </div>
              <button
                onClick={togglePresentationMode}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-500"
              >
                Exit Presentation
              </button>
            </div>
          </div>
        </div>

        {/* Presentation Content */}
        <div className="p-8 h-full overflow-auto">
          {releases.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <p className="text-gray-400 text-xl mb-4">No releases to present</p>
              <p className="text-gray-500 text-lg">Exit presentation mode to add releases</p>
            </div>
          ) : viewMode === "timeline" ? (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Release Timeline</h2>
              <div className="relative">
                {/* Main timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-600"></div>
                
                <div className="space-y-12">
                  {sortedReleases.map((release, index) => (
                    <div key={release.id} className="relative">
                      {/* Timeline dot */}
                      <div className={classNames(
                        "absolute left-5 w-8 h-8 rounded-full border-4 border-gray-900",
                        getReleaseTypeStyles(release.type)
                      )}></div>
                      
                      {/* Content */}
                      <div className="ml-20">
                        <div className={classNames(
                          "relative p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300",
                          // Sticky note colors based on release type
                          release.type === "major" ? "bg-red-200" :
                          release.type === "minor" ? "bg-blue-200" :
                          release.type === "patch" ? "bg-green-200" :
                          release.type === "hotfix" ? "bg-orange-200" :
                          "bg-yellow-200"
                        )}>
                          {/* Tape effect */}
                          <div className="absolute -top-3 left-6 w-20 h-8 bg-gray-400/30 rounded transform -rotate-12"></div>
                          <div className="absolute -top-3 right-12 w-16 h-6 bg-gray-400/30 rounded transform rotate-6"></div>
                          
                          {/* Shadow effect */}
                          <div className="absolute inset-0 bg-black/10 rounded transform translate-x-2 translate-y-2 -z-10"></div>
                          
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={classNames(
                                  "px-4 py-2 text-sm font-semibold rounded-full uppercase flex items-center gap-2 shadow-md",
                                  getReleaseTypeStyles(release.type)
                                )}>
                                  <span className="text-lg">{getReleaseTypeEmoji(release.type)}</span>
                                  {release.type}
                                </span>
                                <span className={classNames(
                                  "px-4 py-2 text-sm font-medium rounded-full border flex items-center gap-2 shadow-md",
                                  getStatusStyles(release.status)
                                )}>
                                  <span>{getStatusEmoji(release.status)}</span>
                                  {release.status.replace("-", " ")}
                                </span>
                              </div>
                              <h3 className="text-gray-900 font-bold text-3xl mb-3 break-words">
                                {release.version} - {release.title}
                              </h3>
                              <p className="text-gray-700 text-lg mb-4 font-medium">
                                {new Date(release.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {release.description && (
                                <p className="text-gray-800 text-lg leading-relaxed break-words">
                                  {release.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Sticky note lines */}
                          <div className="absolute bottom-6 left-8 right-8">
                            <div className="border-b border-gray-400/30 mb-2"></div>
                            <div className="border-b border-gray-400/30 mb-2"></div>
                            <div className="border-b border-gray-400/30"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Calendar View
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Release Calendar</h2>
              {(() => {
                // Get current month or the month with releases
                const today = new Date();
                const releaseMonths = sortedReleases.length > 0 
                  ? [...new Set(sortedReleases.map(r => new Date(r.date).toISOString().slice(0, 7)))]
                  : [today.toISOString().slice(0, 7)];
                
                return releaseMonths.map(monthStr => {
                  const [year, month] = monthStr.split('-').map(Number);
                  const firstDay = new Date(year, month - 1, 1);
                  const lastDay = new Date(year, month, 0);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
                  
                  const monthReleases = sortedReleases.filter(r => 
                    new Date(r.date).toISOString().slice(0, 7) === monthStr
                  );
                  
                  // Generate calendar days
                  const calendarDays = [];
                  const currentDate = new Date(startDate);
                  
                  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
                    const dayReleases = monthReleases.filter(r => 
                      new Date(r.date).toDateString() === currentDate.toDateString()
                    );
                    
                    calendarDays.push({
                      date: new Date(currentDate),
                      isCurrentMonth: currentDate.getMonth() === month - 1,
                      isToday: currentDate.toDateString() === today.toDateString(),
                      releases: dayReleases
                    });
                    
                    currentDate.setDate(currentDate.getDate() + 1);
                  }
                  
                  return (
                    <div key={monthStr} className="bg-white/5 rounded-lg p-8 border border-white/10">
                      {/* Calendar Header */}
                      <div className="mb-8">
                        <h3 className="text-4xl font-bold text-white text-center">
                          {firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                      </div>
                      
                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 gap-3 mb-4">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <div key={day} className="text-center text-lg font-semibold text-gray-400 py-3">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-3">
                        {calendarDays.map((day, index) => (
                          <div
                            key={index}
                            className={classNames(
                              "min-h-[120px] p-3 border border-white/10 rounded-lg relative",
                              day.isCurrentMonth ? "bg-white/5" : "bg-gray-800/50",
                              day.isToday ? "ring-2 ring-indigo-500" : "",
                              day.releases.length > 0 ? "bg-indigo-900/20" : ""
                            )}
                          >
                            {/* Date Number */}
                            <div className={classNames(
                              "text-lg font-medium mb-2",
                              day.isCurrentMonth ? "text-white" : "text-gray-500",
                              day.isToday ? "text-indigo-400 font-bold" : ""
                            )}>
                              {day.date.getDate()}
                            </div>
                            
                            {/* Releases for this day */}
                            <div className="space-y-1">
                              {day.releases.slice(0, 3).map((release, idx) => (
                                <div
                                  key={release.id}
                                  className={classNames(
                                    "text-sm px-2 py-1 rounded cursor-pointer transition-all hover:scale-105 flex items-center gap-2 font-medium",
                                    release.type === "major" ? "bg-red-600 text-white" :
                                    release.type === "minor" ? "bg-blue-600 text-white" :
                                    release.type === "patch" ? "bg-green-600 text-white" :
                                    release.type === "hotfix" ? "bg-orange-600 text-white" :
                                    "bg-gray-600 text-white"
                                  )}
                                  title={`${release.version} - ${release.title}${release.description ? '\n' + release.description : ''}`}
                                >
                                  <span>{getReleaseTypeEmoji(release.type)}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="truncate">{release.version}</div>
                                    <div className="truncate text-xs opacity-90">{release.title}</div>
                                  </div>
                                </div>
                              ))}
                              {day.releases.length > 3 && (
                                <div className="text-xs text-gray-400 px-2 py-1">
                                  +{day.releases.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Month Legend */}
                      {monthReleases.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <h4 className="text-xl font-semibold text-white mb-4">Releases this month:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {monthReleases.map(release => (
                              <div key={release.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                  <span className={classNames(
                                    "px-3 py-1 text-sm font-medium rounded uppercase flex items-center gap-2",
                                    getReleaseTypeStyles(release.type)
                                  )}>
                                    <span>{getReleaseTypeEmoji(release.type)}</span>
                                    {release.type}
                                  </span>
                                  <div>
                                    <div className="text-white font-medium">
                                      {release.version} - {release.title}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                      {new Date(release.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </div>
                                    {release.description && (
                                      <div className="text-gray-300 text-sm mt-1 line-clamp-2">
                                        {release.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Changes.page" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@techulus" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Changes.page" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Release Calendar & Timeline Visualizer",
              "description": description,
              "url": canonicalUrl,
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Changes.page",
                "url": "https://changes.page"
              }
            })
          }}
        />
      </Head>
      {createToastWrapper(theme)}
      <MarketingHeaderComponent title={title} description={description} />
      <div className="relative isolate bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            
            {/* Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex rounded-md bg-white/5" role="group">
                  <button
                    onClick={() => setViewMode("timeline")}
                    className={classNames(
                      "px-3 py-2 text-sm font-medium rounded-l-md",
                      viewMode === "timeline"
                        ? "bg-indigo-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <ViewListIcon className="w-4 h-4 mr-1 inline" />
                    Timeline
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={classNames(
                      "px-3 py-2 text-sm font-medium rounded-r-md",
                      viewMode === "calendar"
                        ? "bg-indigo-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <ViewGridIcon className="w-4 h-4 mr-1 inline" />
                    Calendar
                  </button>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-400"
                >
                  Add Release
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={generateSampleData}
                  className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-500"
                >
                  Sample Data
                </button>
                <button
                  onClick={togglePresentationMode}
                  className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-500"
                  disabled={releases.length === 0}
                >
                  <PresentationChartLineIcon className="w-4 h-4 mr-1 inline" />
                  Present
                </button>
                <button
                  onClick={resetData}
                  className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500"
                >
                  <RefreshIcon className="w-4 h-4 mr-1 inline" />
                  Reset
                </button>
              </div>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="mb-8 bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {editingRelease ? "Edit Release" : "Add New Release"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingRelease(null);
                      setFormData({
                        version: "",
                        date: "",
                        title: "",
                        type: "minor",
                        status: "planned",
                        description: "",
                      });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Version *
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="1.0.0"
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Release Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="New Features"
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Release["type"] }))}
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    >
                      <option value="major">Major</option>
                      <option value="minor">Minor</option>
                      <option value="patch">Patch</option>
                      <option value="hotfix">Hotfix</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Release["status"] }))}
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="released">Released</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description..."
                      className="w-full rounded-md border-0 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveRelease}
                    className="px-6 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-400"
                  >
                    {editingRelease ? "Update Release" : "Add Release"}
                  </button>
                </div>
              </div>
            )}


            {/* Release Visualization */}
            <div className="bg-white/5 rounded-lg p-6">
              {releases.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No releases planned yet</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Add your first release or load sample data to get started
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-400"
                  >
                    Add First Release
                  </button>
                </div>
              ) : viewMode === "timeline" ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Release Timeline</h3>
                  <div className="relative">
                    {/* Main timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
                    
                    <div className="space-y-8">
                      {sortedReleases.map((release, index) => (
                        <div key={release.id} className="relative">
                          {/* Timeline dot */}
                          <div className={classNames(
                            "absolute left-4 w-5 h-5 rounded-full border-4 border-gray-900",
                            getReleaseTypeStyles(release.type)
                          )}></div>
                          
                          {/* Content */}
                          <div className="ml-16">
                            <div className={classNames(
                              "relative p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-200",
                              // Sticky note colors based on release type
                              release.type === "major" ? "bg-red-200" :
                              release.type === "minor" ? "bg-blue-200" :
                              release.type === "patch" ? "bg-green-200" :
                              release.type === "hotfix" ? "bg-orange-200" :
                              "bg-yellow-200"
                            )}>
                              {/* Tape effect */}
                              <div className="absolute -top-2 left-4 w-16 h-6 bg-gray-400/30 rounded transform -rotate-12"></div>
                              <div className="absolute -top-2 right-8 w-12 h-5 bg-gray-400/30 rounded transform rotate-6"></div>
                              
                              {/* Shadow effect */}
                              <div className="absolute inset-0 bg-black/5 rounded transform translate-x-1 translate-y-1 -z-10"></div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={classNames(
                                      "px-3 py-1 text-xs font-semibold rounded-full uppercase flex items-center gap-1 shadow-sm",
                                      getReleaseTypeStyles(release.type)
                                    )}>
                                      <span>{getReleaseTypeEmoji(release.type)}</span>
                                      {release.type}
                                    </span>
                                    <span className={classNames(
                                      "px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 shadow-sm",
                                      getStatusStyles(release.status)
                                    )}>
                                      <span>{getStatusEmoji(release.status)}</span>
                                      {release.status.replace("-", " ")}
                                    </span>
                                  </div>
                                  <h4 className="text-gray-900 font-bold text-xl mb-2 break-words">
                                    {release.version} - {release.title}
                                  </h4>
                                  <p className="text-gray-700 text-sm mb-3 font-medium">
                                    {new Date(release.date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  {release.description && (
                                    <p className="text-gray-800 text-sm leading-relaxed break-words">
                                      {release.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditRelease(release)}
                                    className="px-3 py-1 text-blue-700 hover:text-blue-800 hover:bg-blue-100/50 rounded-full text-sm font-medium transition-colors shadow-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRelease(release.id)}
                                    className="px-3 py-1 text-red-700 hover:text-red-800 hover:bg-red-100/50 rounded-full text-sm font-medium transition-colors shadow-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              
                              {/* Sticky note lines */}
                              <div className="absolute bottom-4 left-6 right-6">
                                <div className="border-b border-gray-400/20 mb-1"></div>
                                <div className="border-b border-gray-400/20 mb-1"></div>
                                <div className="border-b border-gray-400/20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Calendar View
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Release Calendar</h3>
                  {(() => {
                    // Get current month or the month with releases
                    const today = new Date();
                    const releaseMonths = sortedReleases.length > 0 
                      ? [...new Set(sortedReleases.map(r => new Date(r.date).toISOString().slice(0, 7)))]
                      : [today.toISOString().slice(0, 7)];
                    
                    return releaseMonths.map(monthStr => {
                      const [year, month] = monthStr.split('-').map(Number);
                      const firstDay = new Date(year, month - 1, 1);
                      const lastDay = new Date(year, month, 0);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
                      
                      const monthReleases = sortedReleases.filter(r => 
                        new Date(r.date).toISOString().slice(0, 7) === monthStr
                      );
                      
                      // Generate calendar days
                      const calendarDays = [];
                      const currentDate = new Date(startDate);
                      
                      for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
                        const dayReleases = monthReleases.filter(r => 
                          new Date(r.date).toDateString() === currentDate.toDateString()
                        );
                        
                        calendarDays.push({
                          date: new Date(currentDate),
                          isCurrentMonth: currentDate.getMonth() === month - 1,
                          isToday: currentDate.toDateString() === today.toDateString(),
                          releases: dayReleases
                        });
                        
                        currentDate.setDate(currentDate.getDate() + 1);
                      }
                      
                      return (
                        <div key={monthStr} className="bg-white/5 rounded-lg p-6 border border-white/10">
                          {/* Calendar Header */}
                          <div className="mb-6">
                            <h4 className="text-xl font-bold text-white text-center">
                              {firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h4>
                          </div>
                          
                          {/* Days of Week Header */}
                          <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                                {day}
                              </div>
                            ))}
                          </div>
                          
                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => (
                              <div
                                key={index}
                                className={classNames(
                                  "min-h-[80px] p-2 border border-white/10 rounded relative",
                                  day.isCurrentMonth ? "bg-white/5" : "bg-gray-800/50",
                                  day.isToday ? "ring-2 ring-indigo-500" : "",
                                  day.releases.length > 0 ? "bg-indigo-900/20" : ""
                                )}
                              >
                                {/* Date Number */}
                                <div className={classNames(
                                  "text-sm font-medium mb-1",
                                  day.isCurrentMonth ? "text-white" : "text-gray-500",
                                  day.isToday ? "text-indigo-400 font-bold" : ""
                                )}>
                                  {day.date.getDate()}
                                </div>
                                
                                {/* Releases for this day */}
                                <div className="space-y-1">
                                  {day.releases.slice(0, 2).map((release, idx) => (
                                    <div
                                      key={release.id}
                                      className={classNames(
                                        "text-xs px-2 py-1 rounded cursor-pointer transition-all hover:scale-105 truncate flex items-center gap-1",
                                        release.type === "major" ? "bg-red-600 text-white" :
                                        release.type === "minor" ? "bg-blue-600 text-white" :
                                        release.type === "patch" ? "bg-green-600 text-white" :
                                        release.type === "hotfix" ? "bg-orange-600 text-white" :
                                        "bg-gray-600 text-white"
                                      )}
                                      onClick={() => handleEditRelease(release)}
                                      title={`${release.version} - ${release.title}`}
                                    >
                                      <span>{getReleaseTypeEmoji(release.type)}</span>
                                      <span className="truncate">{release.version}</span>
                                    </div>
                                  ))}
                                  {day.releases.length > 2 && (
                                    <div className="text-xs text-gray-400 px-2">
                                      +{day.releases.length - 2} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Month Legend */}
                          {monthReleases.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                              <h5 className="text-sm font-semibold text-white mb-3">Releases this month:</h5>
                              <div className="space-y-2">
                                {monthReleases.map(release => (
                                  <div key={release.id} className="flex items-center justify-between bg-white/5 rounded p-2">
                                    <div className="flex items-center gap-3">
                                      <span className={classNames(
                                        "px-2 py-1 text-xs font-medium rounded uppercase flex items-center gap-1",
                                        getReleaseTypeStyles(release.type)
                                      )}>
                                        <span>{getReleaseTypeEmoji(release.type)}</span>
                                        {release.type}
                                      </span>
                                      <div>
                                        <div className="text-white font-medium text-sm">
                                          {release.version} - {release.title}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                          {new Date(release.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleEditRelease(release)}
                                        className="text-indigo-400 hover:text-indigo-300 text-xs px-2 py-1 rounded hover:bg-indigo-400/10"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRelease(release.id)}
                                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-400/10"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Free Release Calendar Creator Online - Timeline Visualizer | Changes.page",
      description:
        "Create release calendars online with our free release calendar creator app. Plan software releases with interactive timeline and calendar views. Track milestones and manage release schedules.",
      keywords: "release calendar creator online, release calendar creator app, free release calendar, online release calendar, release timeline creator, software release calendar, release planning calendar, create release calendar, release calendar generator, release schedule creator, project release calendar, deployment calendar creator",
      canonicalUrl: "https://changes.page/free-tools/release-calendar",
    },
  };
}