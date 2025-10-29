export default function Loading() {
  const particles = [
    { left: 15, top: 20, delay: 0.5, duration: 2.5 },
    { left: 85, top: 15, delay: 1.2, duration: 3.2 },
    { left: 25, top: 75, delay: 0.8, duration: 2.8 },
    { left: 90, top: 80, delay: 1.5, duration: 3.5 },
    { left: 50, top: 10, delay: 0.3, duration: 2.2 },
    { left: 10, top: 50, delay: 1.8, duration: 3.8 },
    { left: 75, top: 45, delay: 0.7, duration: 2.7 },
    { left: 40, top: 85, delay: 1.3, duration: 3.3 },
    { left: 60, top: 25, delay: 0.9, duration: 2.9 },
    { left: 30, top: 60, delay: 1.1, duration: 3.1 },
    { left: 80, top: 65, delay: 0.6, duration: 2.6 },
    { left: 20, top: 40, delay: 1.7, duration: 3.7 },
    { left: 70, top: 30, delay: 0.4, duration: 2.4 },
    { left: 45, top: 70, delay: 1.4, duration: 3.4 },
    { left: 95, top: 55, delay: 0.2, duration: 2.1 },
    { left: 5, top: 35, delay: 1.6, duration: 3.6 },
    { left: 55, top: 90, delay: 0.1, duration: 2.0 },
    { left: 35, top: 15, delay: 1.9, duration: 3.9 },
    { left: 65, top: 75, delay: 0.5, duration: 2.5 },
    { left: 15, top: 65, delay: 1.0, duration: 3.0 },
  ];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* DarkVeil-inspired animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient circles - Orange and dark theme */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-orange-600/30 to-red-600/20 rounded-full animate-pulse blur-3xl"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-r from-yellow-600/25 to-orange-500/25 rounded-full animate-pulse blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-orange-500/30 to-amber-500/20 rounded-full animate-pulse blur-3xl"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated particles - Orange theme */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/40 rounded-full animate-ping"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* CheFood AI Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            {/* Animated logo background - Orange theme */}
            <div
              className="absolute inset-0 bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>
            <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold bg-linear-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                CF
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            CheFood AI
          </h1>
          <p className="text-gray-400 text-sm">
            Yapay Zeka Destekli Tarif Asistanı
          </p>
        </div>

        {/* DarkVeil-inspired loading animation - Orange theme */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Rotating gradient ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 border-r-amber-500 rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 border-4 border-transparent border-b-yellow-500 border-l-orange-400 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            ></div>
            <div
              className="absolute inset-4 border-4 border-transparent border-t-amber-400 border-r-yellow-400 rounded-full animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
        </div>

        {/* Loading text with gradient - Orange theme */}
        <div className="text-lg font-medium">
          <span className="bg-linear-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
            Yükleniyor...
          </span>
        </div>

        {/* Progress indicator - Orange theme */}
        <div className="mt-6 w-64 h-1 bg-gray-900 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
