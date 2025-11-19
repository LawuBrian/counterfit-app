"use client"

export default function BlackFridayBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-2 overflow-hidden relative">
      <div className="animate-scroll whitespace-nowrap">
        <span className="inline-block mx-8 font-bold text-sm md:text-base">
          🎉 BLACK FRIDAY SPECIAL - LIMITED TIME OFFER - UP TO 30% OFF - SHOP NOW! 🎉
        </span>
        <span className="inline-block mx-8 font-bold text-sm md:text-base">
          🎉 BLACK FRIDAY SPECIAL - LIMITED TIME OFFER - UP TO 30% OFF - SHOP NOW! 🎉
        </span>
        <span className="inline-block mx-8 font-bold text-sm md:text-base">
          🎉 BLACK FRIDAY SPECIAL - LIMITED TIME OFFER - UP TO 30% OFF - SHOP NOW! 🎉
        </span>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

