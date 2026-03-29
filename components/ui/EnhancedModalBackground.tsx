export default function EnhancedModalBackground() {
  return (
    <>
      {/* Animated Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-sm z-40"></div>

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-40">
        {/* Large floating circles */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-slow"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-slow animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float-slow animation-delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-particle-1"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300/40 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-particle-3"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-300/40 rounded-full animate-particle-4"></div>
        <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-indigo-300/40 rounded-full animate-particle-5"></div>

        {/* Geometric shapes */}
        <div className="absolute top-16 right-20 w-16 h-16 border-2 border-white/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rotate-12 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 border border-blue-300/40 rounded-lg rotate-30 animate-pulse-slow"></div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(20px, -30px) scale(1.05) rotate(90deg); }
          50% { transform: translate(-15px, 25px) scale(0.95) rotate(180deg); }
          75% { transform: translate(10px, 15px) scale(1.02) rotate(270deg); }
        }

        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(50px, -30px) scale(1.2); opacity: 0.8; }
        }

        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-40px, 40px) scale(0.8); opacity: 0.9; }
        }

        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(30px, 20px) scale(1.1); opacity: 0.7; }
        }

        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-25px, -35px) scale(0.9); opacity: 0.8; }
        }

        @keyframes particle-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(45px, 25px) scale(1.3); opacity: 0.4; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(12deg); }
          33% { transform: translate(-20px, 20px) scale(1.1) rotate(-12deg); }
          66% { transform: translate(15px, -15px) scale(0.9) rotate(45deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1) rotate(30deg); opacity: 0.4; }
          50% { transform: scale(1.2) rotate(30deg); opacity: 0.8; }
        }

        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 6s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 7s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 5s ease-in-out infinite; }
        .animate-particle-4 { animation: particle-4 8s ease-in-out infinite; }
        .animate-particle-5 { animation: particle-5 9s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }

        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </>
  );
}
