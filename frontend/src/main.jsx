import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';
import '/index.css';
import { motion, AnimatePresence } from 'framer-motion';

// Portfolio Component
const PortfolioPage = ({ portfolio, marketData, formatCurrency }) => {
  if (!portfolio) return <div>Loading portfolio...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Portfolio Overview</h2>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">Total Value</h3>
        <p className="text-3xl font-bold text-blue-600">{formatCurrency(portfolio.totalValue)}</p>
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Asset Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.balances.map(([asset, balance]) => {
          const assetData = marketData.find(d => d.asset === asset);
          const price = assetData ? assetData.price : 0;
          return (
            <motion.div 
              key={asset}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{asset}</span>
                <span className="text-lg font-semibold">{balance.toFixed(4)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Value: {formatCurrency(balance * price)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Market Data Component
const MarketDataPage = ({ marketData, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Market Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((data, index) => (
              <motion.tr 
                key={index} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{data.asset}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(data.price)}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(data.volume)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Trade History Component
const TradeHistoryPage = ({ trades, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.map((trade, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(trade.timestamp / 1000000).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trade.direction === '#BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.direction === '#BUY' ? 'BUY' : 'SELL'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{trade.asset}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.amount.toFixed(4)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(trade.price)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{trade.reason}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Chat Component
const ChatPage = ({ chat, inputValue, isLoading, handleSubmit, setInputValue, chatBoxRef, formatDate }) => {
  // Function to format message content with proper list alignment
  const formatMessageContent = (content) => {
    if (typeof content !== 'string') return content;
    
    // Check if content has list-like structure
    if (content.includes('\n- ') || content.includes('\n* ') || content.includes('\n• ')) {
      return content.split('\n').map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{line.substring(2)}</span>
            </div>
          );
        }
        return <div key={i}>{line}</div>;
      });
    }
    
    // Check for numbered lists
    if (content.match(/\n\d+\. /)) {
      return content.split('\n').map((line, i) => {
        const match = line.match(/^(\d+)\. /);
        if (match) {
          return (
            <div key={i} className="flex items-start">
              <span className="mr-2">{match[1]}.</span>
              <span>{line.substring(match[0].length)}</span>
            </div>
          );
        }
        return <div key={i}>{line}</div>;
      });
    }
    
    return content;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto rounded-t-lg bg-white p-4 shadow-inner" ref={chatBoxRef}>
        <AnimatePresence>
          {chat.map((message, index) => {
            const isUser = 'user' in message.role;
            const img = isUser ? userImg : botImg;
            const name = isUser ? 'You' : 'Quantumic';
            const text = message.content;
            const formattedText = formatMessageContent(text);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isUser ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {!isUser && (
                  <div
                    className="mr-2 h-10 w-10 rounded-full flex-shrink-0"
                    style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                  ></div>
                )}
                <div className={`max-w-[70%] rounded-lg p-3 ${isUser ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-50 shadow'}`}>
                  <div
                    className={`mb-1 flex items-center justify-between text-sm ${isUser ? 'text-blue-100' : 'text-gray-500'}`}
                  >
                    <div className="font-medium">{name}</div>
                    <div className="mx-2">{formatDate(new Date())}</div>
                  </div>
                  <div className={`${isUser ? 'text-white' : 'text-gray-700'} whitespace-pre-wrap`}>
                    {formattedText}
                  </div>
                </div>
                {isUser && (
                  <div
                    className="ml-2 h-10 w-10 rounded-full flex-shrink-0"
                    style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                  ></div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <motion.form 
        className="flex rounded-b-lg border-t border-gray-200 bg-white p-4 shadow-sm"
        onSubmit={handleSubmit}
        whileHover={{ boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
      >
        <input
          type="text"
          className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ask about markets or trading..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          className="rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send'
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chat, setChat] = useState([
    {
      role: { system: null },
      content: "I'm Quantumic, an AI-powered trading bot on ICP. I can analyze markets, execute trades, and answer questions.\n\nHere's what I can help with:\n- Portfolio analysis\n- Market trends\n- Trade execution\n- Risk assessment\n\nTry asking:\n1. What's my portfolio performance?\n2. Show me market trends for BTC\n3. Execute a trade for 0.5 ETH"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [trades, setTrades] = useState([]);
  const chatBoxRef = useRef(null);

  const formatDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const askAgent = async (messages) => {
    try {
      const response = await backend.chat(messages);
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        newChat.push({ role: { system: null }, content: response });
        return newChat;
      });
    } catch (e) {
      console.log(e);
      const eStr = String(e);
      const match = eStr.match(/(SysTransient|CanisterReject), \\+"([^\\"]+)/);
      if (match) {
        alert(match[2]);
      }
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        return newChat;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: { user: null },
      content: inputValue
    };
    const thinkingMessage = {
      role: { system: null },
      content: 'Thinking ...'
    };
    setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
    setInputValue('');
    setIsLoading(true);
    const messagesToSend = chat.slice(1).concat(userMessage);
    askAgent(messagesToSend);
  };

  const fetchPortfolio = async () => {
    try {
      const data = await backend.getPortfolio();
      setPortfolio(data);
    } catch (e) {
      console.error("Failed to fetch portfolio:", e);
    }
  };

  const fetchMarketData = async () => {
    try {
      const data = await backend.getMarketData();
      setMarketData(data);
    } catch (e) {
      console.error("Failed to fetch market data:", e);
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const data = await backend.getTradeHistory();
      setTrades(data);
    } catch (e) {
      console.error("Failed to fetch trade history:", e);
    }
  };

  const executeAutoTrade = async () => {
    try {
      setIsLoading(true);
      const trade = await backend.autoTrade();
      await Promise.all([fetchPortfolio(), fetchTradeHistory()]);
      addSystemMessage(`Executed auto trade: ${trade.direction} ${trade.amount} ${trade.asset} at ${formatCurrency(trade.price)}. Reason: ${trade.reason}`);
    } catch (e) {
      console.error("Auto trade failed:", e);
      addSystemMessage("Auto trade failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const addSystemMessage = (content) => {
    setChat(prev => [...prev, { role: { system: null }, content }]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    // Initial data fetch
    fetchPortfolio();
    fetchMarketData();
    fetchTradeHistory();

    // Set up periodic refreshes
    const interval = setInterval(() => {
      fetchPortfolio();
      fetchMarketData();
      fetchTradeHistory();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 shadow-xl"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
            Quantumic
          </h1>
        </div>
        
        <nav className="space-y-1">
          <motion.button
            onClick={() => setActiveTab('chat')}
            className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'chat' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            AI Chat
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'portfolio' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Portfolio
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('market')}
            className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'market' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            Market Data
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('trades')}
            className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'trades' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            Trade History
          </motion.button>
        </nav>

        <div className="mt-8">
          <motion.button
            onClick={executeAutoTrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white p-3 rounded-lg shadow flex items-center justify-center"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Execute Auto Trade
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <ChatPage 
              chat={chat}
              inputValue={inputValue}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              setInputValue={setInputValue}
              chatBoxRef={chatBoxRef}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioPage 
              portfolio={portfolio}
              marketData={marketData}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === 'market' && (
            <MarketDataPage 
              marketData={marketData}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === 'trades' && (
            <TradeHistoryPage 
              trades={trades}
              formatCurrency={formatCurrency}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);