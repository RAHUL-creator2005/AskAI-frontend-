import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatBox from './components/ChatBox.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatBox />} />
    </Routes>
  );
}

export default App;
