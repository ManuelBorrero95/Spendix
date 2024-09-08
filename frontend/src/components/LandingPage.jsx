import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const navigate = useNavigate();

  const fullText = "Ciao, io sono Spendix!\nSono il tuo assistente per la gestione delle tue finanze.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTyping(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (startTyping && typedText.length < fullText.length) {
      const typingTimer = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50);
      return () => clearTimeout(typingTimer);
    } else if (typedText === fullText) {
      setTimeout(() => {
        setShowButton(true);
      }, 400);
    }
  }, [typedText, startTyping]);

  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white transition-colors duration-1000">
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold whitespace-pre-line">{typedText}</h1>
        </div>
        
        {showButton && (
          <button 
            className="bg-[#2C66C9] text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition duration-300"
            onClick={handleStartClick}
          >
            Iniziamo!
          </button>
        )}
      </main>
      
      <footer className="bg-black text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2024 Spendix. Tutti i diritti riservati.</p>
      </div>
    </footer>
    </div>
  );
};

export default LandingPage;