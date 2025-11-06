import { useState } from "react";

function App() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");

  const handleLaunch = async () => {
    if (!tokenName || !tokenSymbol) return;
    
    setIsLaunching(true);
    setLaunchSuccess(false);
    
    try {
      const response = await fetch("http://localhost:3001/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tokenName,
          symbol: tokenSymbol,
          initialSupply: 1000000, // Default supply
          network: "sepolia", // Deploying to Sepolia testnet
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLaunchSuccess(true);
        setDeployedAddress(result.address || "");
        console.log("Token deployed successfully:", result);
        
        setTimeout(() => {
          setLaunchSuccess(false);
          setTokenName("");
          setTokenSymbol("");
          setDeployedAddress("");
        }, 10000);
      } else {
        console.error("Deployment failed:", result.error);
        alert(`Deployment failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deploying token:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center transform transition-transform hover:scale-110 duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Token Launcher
          </h1>
          <p className="text-purple-300 text-lg">
            Deploy your token on any network
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 transition-colors group-focus-within:text-purple-400">
                Token Name
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Ethereum"
                className="w-full px-4 py-3.5 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 transition-colors group-focus-within:text-purple-400">
                Token Symbol
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                placeholder="ETH"
                maxLength={6}
                className="w-full px-4 py-3.5 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 uppercase"
              />
              <p className="text-xs text-purple-400/60 mt-2">
                Maximum 6 characters
              </p>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isLaunching || launchSuccess || !tokenName || !tokenSymbol}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                isLaunching || launchSuccess || !tokenName || !tokenSymbol
                  ? "bg-purple-900/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              {isLaunching ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deploying Contract...
                </span>
              ) : launchSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Token Deployed
                </span>
              ) : (
                "Deploy Token"
              )}
            </button>
          </div>

          {launchSuccess && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-violet-900/40 border border-purple-500/50 rounded-xl animate-fadeIn">
              <p className="text-purple-200 text-sm text-center mb-2">
                <span className="font-semibold">{tokenName}</span> ({tokenSymbol}) deployed successfully
              </p>
              {deployedAddress && (
                <p className="text-purple-300 text-xs text-center break-all font-mono">
                  Address: {deployedAddress}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-purple-400/60 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Sepolia Testnet
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;