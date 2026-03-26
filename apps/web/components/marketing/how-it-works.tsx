export default function HowItWorks() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl hero">
            Different inputs. Same beautiful output.
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            However your content arrives, your users see the same beautifully
            formatted, branded changelog page.
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="hidden lg:block absolute left-1/4 right-1/4 top-[120px] h-px bg-gradient-to-r from-indigo-500/50 via-gray-700 to-green-500/50" />
          <div className="hidden lg:block absolute left-1/2 top-[120px] bottom-[80px] w-px bg-gradient-to-b from-gray-700 to-indigo-500/50" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 mb-6">
                <span className="text-2xl font-bold text-indigo-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Write in the editor
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                Open the dashboard, use the markdown editor, add images, set
                tags, and schedule publishing — all from the web UI.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/30 mb-6">
                <span className="text-2xl font-bold text-green-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Push from the terminal
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                Run{" "}
                <code className="text-green-400 bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                  chp posts create
                </code>{" "}
                from your CI/CD pipeline. Pipe in release notes from your build
                system.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-green-500/20 border-2 border-indigo-500/30 mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Your changelog, published
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Same beautifully formatted page. Same email notifications.
              Same branded experience for your users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
