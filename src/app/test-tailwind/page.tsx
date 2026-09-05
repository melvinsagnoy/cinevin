export default function TestTailwindPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#09090b', 
      padding: '2rem',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>
        Tailwind Test
      </h1>
      
      {/* Test with Tailwind classes */}
      <div className="bg-white/10 p-4 rounded-lg mb-4 border border-white/5">
        <p className="text-white">If this text is white, Tailwind is partially working.</p>
        <p className="text-zinc-400 text-sm">This should be gray text.</p>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <span className="bg-red-500 px-3 py-1 rounded-full text-white text-sm">Red Badge</span>
        <span className="bg-blue-500 px-3 py-1 rounded-full text-white text-sm">Blue Badge</span>
        <span className="bg-green-500 px-3 py-1 rounded-full text-white text-sm">Green Badge</span>
      </div>
      
      <div className="mt-4 p-4 border border-white/10 rounded-lg">
        <p className="text-zinc-400">This should be gray text on a dark background with a border.</p>
        <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Test Button
        </button>
      </div>
    </div>
  )
}