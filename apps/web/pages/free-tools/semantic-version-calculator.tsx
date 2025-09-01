import { CheckIcon, RefreshIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  createToastWrapper,
  notifyError,
  notifySuccess,
} from "../../components/core/toast.component";
import FooterComponent from "../../components/layout/footer.component";
import MarketingHeaderComponent from "../../components/marketing/marketing-header.component";
import usePrefersColorScheme from "../../utils/hooks/usePrefersColorScheme";

interface SemverResult {
  version: string;
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  buildMetadata?: string;
}

interface BulkResult {
  original: string;
  new: string;
  type: string;
}

export default function SemanticVersionCalculator({
  title,
  description,
  keywords,
  canonicalUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = usePrefersColorScheme();

  // Single version calculator state
  const [currentVersion, setCurrentVersion] = useState("1.0.0");
  const [changeType, setChangeType] = useState<"major" | "minor" | "patch">("patch");
  const [prerelease, setPrerelease] = useState("");
  const [buildMetadata, setBuildMetadata] = useState("");

  // Bulk calculator state
  const [bulkVersions, setBulkVersions] = useState("");
  const [bulkChangeType, setBulkChangeType] = useState<"major" | "minor" | "patch">("patch");

  // Results
  const [result, setResult] = useState<SemverResult | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "validator">("single");
  
  // Validator state
  const [versionToValidate, setVersionToValidate] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    parsed?: SemverResult;
    error?: string;
  } | null>(null);

  const parseSemver = useCallback((version: string): SemverResult | null => {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    const match = version.match(semverRegex);
    
    if (!match) return null;
    
    return {
      version,
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4],
      buildMetadata: match[5],
    };
  }, []);

  const bumpVersion = useCallback((
    semver: SemverResult,
    type: "major" | "minor" | "patch",
    prereleaseTag?: string,
    buildMeta?: string
  ): string => {
    let major = semver.major;
    let minor = semver.minor;
    let patch = semver.patch;

    switch (type) {
      case "major":
        major += 1;
        minor = 0;
        patch = 0;
        break;
      case "minor":
        minor += 1;
        patch = 0;
        break;
      case "patch":
        patch += 1;
        break;
    }

    let newVersion = `${major}.${minor}.${patch}`;
    
    if (prereleaseTag) {
      newVersion += `-${prereleaseTag}`;
    }
    
    if (buildMeta) {
      newVersion += `+${buildMeta}`;
    }

    return newVersion;
  }, []);

  const calculateVersion = useCallback(() => {
    const parsed = parseSemver(currentVersion.trim());
    if (!parsed) {
      notifyError("Invalid semantic version format. Use x.y.z format.");
      return;
    }

    const newVersion = bumpVersion(parsed, changeType, prerelease || undefined, buildMetadata || undefined);
    const newParsed = parseSemver(newVersion);
    
    if (newParsed) {
      setResult(newParsed);
    }
  }, [currentVersion, changeType, prerelease, buildMetadata, parseSemver, bumpVersion]);

  const calculateBulkVersions = useCallback(() => {
    const versions = bulkVersions
      .split('\n')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    if (versions.length === 0) {
      notifyError("Please enter at least one version");
      return;
    }

    const results: BulkResult[] = [];
    
    for (const version of versions) {
      const parsed = parseSemver(version);
      if (parsed) {
        const newVersion = bumpVersion(parsed, bulkChangeType);
        results.push({
          original: version,
          new: newVersion,
          type: bulkChangeType,
        });
      } else {
        results.push({
          original: version,
          new: "Invalid format",
          type: "error",
        });
      }
    }

    setBulkResults(results);
  }, [bulkVersions, bulkChangeType, parseSemver, bumpVersion]);

  const copyToClipboard = useCallback((text: string) => {
    navigator?.clipboard?.writeText(text);
    notifySuccess("Copied to clipboard");
  }, []);

  const copyAllBulkResults = useCallback(() => {
    const text = bulkResults
      .filter(r => r.type !== "error")
      .map(r => r.new)
      .join('\n');
    copyToClipboard(text);
  }, [bulkResults, copyToClipboard]);

  const resetSingle = useCallback(() => {
    setResult(null);
    setCurrentVersion("1.0.0");
    setPrerelease("");
    setBuildMetadata("");
  }, []);

  const resetBulk = useCallback(() => {
    setBulkResults([]);
    setBulkVersions("");
  }, []);

  const validateVersion = useCallback(() => {
    if (!versionToValidate.trim()) {
      setValidationResult({
        isValid: false,
        error: "Please enter a version to validate"
      });
      return;
    }

    const parsed = parseSemver(versionToValidate.trim());
    if (parsed) {
      setValidationResult({
        isValid: true,
        parsed
      });
    } else {
      setValidationResult({
        isValid: false,
        error: "Invalid semantic version format. Expected format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]"
      });
    }
  }, [versionToValidate, parseSemver]);

  const resetValidator = useCallback(() => {
    setValidationResult(null);
    setVersionToValidate("");
  }, []);

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
              "name": "Semantic Version Calculator",
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
          <div className="mx-auto max-w-4xl">
            {/* Tab Navigation */}
            <div className="mb-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("single")}
                  className={classNames(
                    activeTab === "single"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-300",
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                  )}
                >
                  Single Version
                </button>
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={classNames(
                    activeTab === "bulk"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-300",
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                  )}
                >
                  Bulk Calculator
                </button>
                <button
                  onClick={() => setActiveTab("validator")}
                  className={classNames(
                    activeTab === "validator"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-300",
                    "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                  )}
                >
                  Validator
                </button>
              </nav>
            </div>

            {activeTab === "single" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Single Version Calculator
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Current Version
                    </label>
                    <input
                      type="text"
                      value={currentVersion}
                      onChange={(e) => setCurrentVersion(e.target.value)}
                      placeholder="1.0.0"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Change Type
                    </label>
                    <select
                      value={changeType}
                      onChange={(e) => setChangeType(e.target.value as "major" | "minor" | "patch")}
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    >
                      <option value="patch">Patch (bug fixes)</option>
                      <option value="minor">Minor (new features)</option>
                      <option value="major">Major (breaking changes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Pre-release Tag (optional)
                    </label>
                    <input
                      type="text"
                      value={prerelease}
                      onChange={(e) => setPrerelease(e.target.value)}
                      placeholder="alpha.1, beta.2, rc.1"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Build Metadata (optional)
                    </label>
                    <input
                      type="text"
                      value={buildMetadata}
                      onChange={(e) => setBuildMetadata(e.target.value)}
                      placeholder="20230101.001, build.123"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <button
                    onClick={calculateVersion}
                    className="w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Calculate Next Version
                  </button>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  {result ? (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Result</h3>
                      <div className="bg-white/5 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">New Version:</span>
                          <code className="text-lg font-mono text-white bg-gray-800 px-2 py-1 rounded">
                            {result.version}
                          </code>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-400">Major</span>
                            <span className="text-white font-mono">{result.major}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">Minor</span>
                            <span className="text-white font-mono">{result.minor}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">Patch</span>
                            <span className="text-white font-mono">{result.patch}</span>
                          </div>
                        </div>

                        {result.prerelease && (
                          <div>
                            <span className="block text-gray-400 text-sm">Pre-release</span>
                            <span className="text-white font-mono">{result.prerelease}</span>
                          </div>
                        )}

                        {result.buildMetadata && (
                          <div>
                            <span className="block text-gray-400 text-sm">Build Metadata</span>
                            <span className="text-white font-mono">{result.buildMetadata}</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => copyToClipboard(result.version)}
                            className="flex-1 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                          >
                            Copy Version
                          </button>
                          <button
                            onClick={resetSingle}
                            className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                          >
                            <RefreshIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        Enter a version and select change type to calculate the next semantic version
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === "bulk" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bulk Input Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Bulk Version Calculator
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Versions (one per line)
                    </label>
                    <textarea
                      rows={10}
                      value={bulkVersions}
                      onChange={(e) => setBulkVersions(e.target.value)}
                      placeholder="1.0.0&#10;2.1.3&#10;0.5.2-alpha.1"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Change Type
                    </label>
                    <select
                      value={bulkChangeType}
                      onChange={(e) => setBulkChangeType(e.target.value as "major" | "minor" | "patch")}
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    >
                      <option value="patch">Patch (bug fixes)</option>
                      <option value="minor">Minor (new features)</option>
                      <option value="major">Major (breaking changes)</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateBulkVersions}
                    className="w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Calculate All Versions
                  </button>
                </div>

                {/* Bulk Results Section */}
                <div className="space-y-4">
                  {bulkResults.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">Results</h3>
                        <button
                          onClick={copyAllBulkResults}
                          className="text-sm bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded text-white"
                        >
                          Copy All New Versions
                        </button>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                          {bulkResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                              <div className="flex items-center space-x-4">
                                <code className="text-gray-400 font-mono text-sm">
                                  {result.original}
                                </code>
                                <span className="text-gray-500">→</span>
                                <code className={classNames(
                                  "font-mono text-sm px-2 py-1 rounded",
                                  result.type === "error"
                                    ? "bg-red-900/50 text-red-300"
                                    : "bg-gray-800 text-white"
                                )}>
                                  {result.new}
                                </code>
                              </div>
                              {result.type !== "error" && (
                                <button
                                  onClick={() => copyToClipboard(result.new)}
                                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                                >
                                  Copy
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={resetBulk}
                        className="mt-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                      >
                        <RefreshIcon className="inline h-4 w-4 mr-2" />
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        Enter multiple versions (one per line) to calculate their next semantic versions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === "validator" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Validator Input Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Version Validator
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-semibold leading-6 text-white mb-2">
                      Version to Validate
                    </label>
                    <input
                      type="text"
                      value={versionToValidate}
                      onChange={(e) => setVersionToValidate(e.target.value)}
                      placeholder="1.2.3-beta.1+build.123"
                      className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          validateVersion();
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={validateVersion}
                    className="w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Validate Version
                  </button>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Valid Examples:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-300"><code className="bg-gray-800 px-2 py-1 rounded">1.0.0</code> - Basic version</div>
                      <div className="text-gray-300"><code className="bg-gray-800 px-2 py-1 rounded">2.1.3-alpha.1</code> - With prerelease</div>
                      <div className="text-gray-300"><code className="bg-gray-800 px-2 py-1 rounded">1.0.0+build.123</code> - With build metadata</div>
                      <div className="text-gray-300"><code className="bg-gray-800 px-2 py-1 rounded">3.0.0-rc.1+build.456</code> - Full version</div>
                    </div>
                  </div>
                </div>

                {/* Validator Results Section */}
                <div className="space-y-4">
                  {validationResult ? (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Validation Result</h3>
                      <div className={classNames(
                        "rounded-lg p-4 space-y-3",
                        validationResult.isValid ? "bg-green-900/20 border border-green-500/20" : "bg-red-900/20 border border-red-500/20"
                      )}>
                        <div className="flex items-center">
                          <div className={classNames(
                            "w-3 h-3 rounded-full mr-3",
                            validationResult.isValid ? "bg-green-400" : "bg-red-400"
                          )} />
                          <span className={classNames(
                            "font-semibold",
                            validationResult.isValid ? "text-green-300" : "text-red-300"
                          )}>
                            {validationResult.isValid ? "Valid Semantic Version" : "Invalid Version"}
                          </span>
                        </div>

                        {validationResult.isValid && validationResult.parsed ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="block text-gray-400">Major</span>
                                <span className="text-white font-mono">{validationResult.parsed.major}</span>
                              </div>
                              <div>
                                <span className="block text-gray-400">Minor</span>
                                <span className="text-white font-mono">{validationResult.parsed.minor}</span>
                              </div>
                              <div>
                                <span className="block text-gray-400">Patch</span>
                                <span className="text-white font-mono">{validationResult.parsed.patch}</span>
                              </div>
                            </div>

                            {validationResult.parsed.prerelease && (
                              <div>
                                <span className="block text-gray-400 text-sm">Pre-release</span>
                                <span className="text-white font-mono">{validationResult.parsed.prerelease}</span>
                              </div>
                            )}

                            {validationResult.parsed.buildMetadata && (
                              <div>
                                <span className="block text-gray-400 text-sm">Build Metadata</span>
                                <span className="text-white font-mono">{validationResult.parsed.buildMetadata}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-red-200 text-sm">
                            {validationResult.error}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {validationResult.isValid && (
                            <button
                              onClick={() => copyToClipboard(validationResult.parsed!.version)}
                              className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
                            >
                              Copy Version
                            </button>
                          )}
                          <button
                            onClick={resetValidator}
                            className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                          >
                            <RefreshIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        Enter a version string to validate its semantic versioning format
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Educational Content Section */}
            <div className="mt-12 border-t border-gray-700 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">What is Semantic Versioning?</h2>
                  <div className="prose prose-gray prose-invert text-sm space-y-3">
                    <p className="text-gray-300">
                      Semantic Versioning (SemVer) is a versioning scheme for software that aims to convey meaning about the underlying changes with each new release.
                    </p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Format: MAJOR.MINOR.PATCH</h3>
                      <ul className="space-y-1 text-gray-300">
                        <li><strong className="text-red-300">MAJOR</strong> - incompatible API changes</li>
                        <li><strong className="text-yellow-300">MINOR</strong> - new functionality (backwards compatible)</li>
                        <li><strong className="text-green-300">PATCH</strong> - bug fixes (backwards compatible)</li>
                      </ul>
                    </div>
                    <p className="text-gray-300">
                      Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Version Examples & Rules</h2>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Version Progression</h3>
                      <div className="space-y-1 text-sm">
                        <div className="text-gray-300">1.0.0 → 1.0.1 (patch)</div>
                        <div className="text-gray-300">1.0.1 → 1.1.0 (minor)</div>
                        <div className="text-gray-300">1.1.0 → 2.0.0 (major)</div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Pre-release Versions</h3>
                      <div className="space-y-1 text-sm">
                        <div className="text-gray-300">1.0.0-alpha {"<"} 1.0.0-alpha.1</div>
                        <div className="text-gray-300">1.0.0-beta {"<"} 1.0.0-beta.2</div>
                        <div className="text-gray-300">1.0.0-rc.1 {"<"} 1.0.0</div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Best Practices</h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Start with 1.0.0 for initial release</li>
                        <li>• Use 0.y.z for initial development</li>
                        <li>• Never reuse version numbers</li>
                        <li>• Document breaking changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
      title: "Free Semantic Version Calculator - SemVer Bump Tool | Changes.page",
      description:
        "Calculate next semantic versions following semver rules. Free tool for major, minor, patch version bumps with pre-release tags and build metadata. Bulk version calculator included.",
      keywords: "semantic versioning, semver calculator, version bump, npm version, software versioning, semantic version tool, version calculator, semver bump, pre-release versioning, build metadata, bulk version calculator, free semver tool",
      canonicalUrl: "https://changes.page/free-tools/semantic-version-calculator",
    },
  };
}