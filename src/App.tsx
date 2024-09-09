import { useState } from 'react';
import Layout from './Layout.tsx';
import CableCalculate from './components/CableCalculate.tsx';
import CableTray from './components/CableTray.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import store from './store.tsx';
import { GlobalProvider } from './context';
//import './App.css'
function App() {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route path='cable_calculate' element={<CableCalculate />} />
                        <Route path='cable_tray' element={<CableTray />} />
                     </Route>
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    );
}

export default App
