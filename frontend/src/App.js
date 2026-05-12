import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KeysProvider } from './context/KeysContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DiscussionPage from './pages/DiscussionPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

export default function App() {
  return (
    <KeysProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discussion/:id" element={<DiscussionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </KeysProvider>
  );
}
