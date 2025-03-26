import React, { useState, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataApi } from '../api/dataApi';
import groqApi from '../api/groqApi';
import AnalyticsProcessor from '../utils/AnalyticsProcessor';

const AnalyticsPage = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dataApi.getData();
        console.log('Fetched data:', {
          success: !!result,
          length: result?.length,
          sample: result?.slice(0, 2)
        });
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !data) return;

    setIsSubmitting(true);
    setMessages(prev => [...prev, { text: query, sender: 'user' }]);

    try {
        // Handle greetings
        const greetings = ['hi', 'hello', 'hey'];
        if (greetings.includes(query.toLowerCase().trim())) {
            const response = await groqApi.chat([
                {
                    role: "system",
                    content: `You are ESG-AI. Respond to the greeting and suggest some analysis options like "Would you like to analyze companies by investment?" or "Would you like to see emissions data for different funds?"`
                },
                {
                    role: "user",
                    content: query
                }
            ]);

            setMessages(prev => [...prev, {
                text: response.content,
                sender: 'bot'
            }]);
            
        } else {
            // Regular analysis query
            const processor = new AnalyticsProcessor(data);
            const results = processor.analyzeData(query);

            // Create a clean data representation with only relevant columns
            const cleanData = results.data.map(item => {
                // For overall analysis
                if (results.type.includes('overall')) {
                    const relevantData = {
                        name: item.name
                    };
                    // Only include metrics that have non-zero values
                    results.metrics.forEach(metric => {
                        if (item[metric]?.raw > 0) {
                            relevantData[metric] = item[metric].display;
                        }
                    });
                    return relevantData;
                }
                // For specific metric analysis
                else {
                    return {
                        name: item.name,
                        [results.metrics[0]]: item[results.metrics[0]].display
                    };
                }
            });

            const response = await groqApi.chat([
                {
                    role: "system",
                    content: `You are ESG-AI. Analyze this ${results.type}:
                    
                    ${JSON.stringify(cleanData, null, 2)}

                    Instructions:
                    1. Start with "Based on the analysis..."
                    2. List only the top 5 entries with their actual values
                    3. For overall analysis, mention significant patterns across metrics
                    4. Use the exact numbers provided
                    5. End with a relevant follow-up suggestion`
                },
                {
                    role: "user",
                    content: query
                }
            ]);

            setMessages(prev => [...prev, {
                text: response.content,
                sender: 'bot'
            }]);
        }

    } catch (error) {
        console.error('Analysis error:', error);
        setMessages(prev => [
            ...prev,
            { 
                text: `Sorry, I encountered an error: ${error.message}`,
                sender: 'bot'
            }
        ]);
    } finally {
        setIsSubmitting(false);
        setQuery('');
    }
};

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-purple-950/30 to-black">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <div className="p-4 bg-black/80 backdrop-blur-xl border-b border-purple-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center">
              <Bot size={20} className="text-purple-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">ESG Analytics Assistant</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-purple-300/60">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 mt-12"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-950 to-black flex items-center justify-center border border-purple-900/30">
                <Bot size={32} className="text-purple-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  Welcome to ESG Analytics
                </h2>
                <p className="text-purple-300/60 text-sm max-w-md mx-auto">
                  Ask me about ESG metrics, investments, or environmental impact analysis.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${index}-${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'} gap-3`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-lg bg-black/80 flex items-center justify-center border border-purple-900/30">
                      <Bot size={16} className="text-purple-300" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.sender === 'bot'
                        ? 'bg-black/80 text-white border border-purple-900/30'
                        : 'bg-purple-950/50 text-white ml-12'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-purple-900/20">
          <form 
            onSubmit={handleSubmit}
            className="flex gap-2 items-center bg-black/50 rounded-xl p-1.5 
                     border border-purple-900/20 focus-within:border-purple-900/50
                     transition-all duration-300"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Message ESG Analytics..."
              className="flex-1 bg-transparent text-white px-3 py-2 text-sm focus:outline-none placeholder-purple-300/60"
              disabled={isSubmitting}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              disabled={isSubmitting || !query.trim()}
              className={`p-2 rounded-lg flex items-center justify-center 
                       ${isSubmitting || !query.trim()
                         ? 'bg-purple-950/30 cursor-not-allowed'
                         : 'bg-purple-950/50 hover:bg-purple-900/50'
                       } text-white transition-all duration-300`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Prevent unnecessary re-renders
export default React.memo(AnalyticsPage);