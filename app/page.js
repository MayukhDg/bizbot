import Link from "next/link";


export default function Home() {
  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
  <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
      Embed Your AI‑Powered Chatbot in Minutes
    </h1>
    <p className="mt-6 max-w-2xl text-lg md:text-xl text-indigo-100">
      Bizbot lets business owners instantly add a custom AI assistant to their website — just paste a single snippet and start delighting customers 24/7.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <a
        href="#get-started"
        className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50"
      >
        Get Started
      </a>
      <a
        href="#learn-more"
        className="px-6 py-3 bg-indigo-400 text-white border border-white rounded-lg hover:bg-indigo-300"
      >
        Learn More
      </a>
    </div>
  </div>
</section>

      {/* VALUE PROPS */}
      <section className="py-16" id="learn-more">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Bizbot?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Your customers deserve instant, accurate answers. Bizbot makes it effortless to give them that — without extra hires or complex setups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 rounded-xl bg-gray-50 shadow hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-xl mb-2">Instant Setup</h3>
              <p className="text-gray-600">Drop a single snippet into your site and your chatbot is live — no coding, no friction.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 shadow hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">🧠</div>
              <h3 className="font-semibold text-xl mb-2">Learns Over Time</h3>
              <p className="text-gray-600">Updates itself with your latest business info and remembers past Q&As to get smarter with every chat.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 shadow hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">✅</div>
              <h3 className="font-semibold text-xl mb-2">Honest Answers</h3>
              <p className="text-gray-600">If it doesn't know, it says so — building trust instead of guessing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 text-center">
              <div className="mb-4 text-3xl">1️⃣</div>
              <h3 className="font-semibold text-lg mb-2">Add Your Business Info</h3>
              <p className="text-gray-600">Tell Bizbot about your products, policies, and FAQs in a few minutes. Make incremental updates as your business evolves.</p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-3xl">2️⃣</div>
              <h3 className="font-semibold text-lg mb-2">Copy Your Snippet</h3>
              <p className="text-gray-600">Grab your auto‑generated script from the dashboard.</p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-3xl">3️⃣</div>
              <h3 className="font-semibold text-lg mb-2">Start Chatting</h3>
              <p className="text-gray-600">Your visitors can ask anything — Bizbot answers instantly or admits when it can’t.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-indigo-600 text-white py-20" id="get-started">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to give your site a smart, trustworthy assistant?</h2>
          <p className="mt-4 text-indigo-100">Get your chatbot live today — it’s as simple as paste & publish.</p>
          <Link
            href="/register"
            className="mt-8 inline-block px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50"
          >
            Create My Bizbot
          </Link>
        </div>
      </section>
    </main>
  );
}