import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/landing-page/LandingPage';
import SelectionPage from './pages/selection-page/SelectionPage';
import RealNumber from './pages/real-number/RealNumber';
import VirtualNumber from './pages/virtual-number/VirtualNumber';
import SearchResult from './pages/virtual-number/search-result/searchResults';
import OtpPage from './pages/real-number/OtpPage';
import Linked from './pages/real-number/Linked';
import CartCheckout from "./pages/virtual-number/cart/CartCheckout";
import PurchaseSuccessful from "./pages/virtual-number/purchase-successful/Successful";
import HomePage from './pages/home-page/HomePage';
import MintNumber from './pages/virtual-number/purchase-successful/nft/MintNumber';
import VirtualLinked from './pages/virtual-number/purchase-successful/VirtualLinked';
import { GlobalURL } from './constants';
import { useAccount } from 'wagmi';

// const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_CHAIN_ID = 84532;
const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userExists, setUserExists] = useState(null);
  const [networkCorrect, setNetworkCorrect] = useState(false);
  const account = useAccount();
  const navigate = useNavigate();

  const checkIfUserExists = async (address) => {
    try {
      const response = await fetch(`${GlobalURL}/user/getUser/${address}`);
      const data = await response.json();
      console.log("user details from app.jsx", data);
      return data.exists;
      
    } catch (error) {
      console.error("Error checking user existence", error);
      return false;
    }
  };

  const fetchUserExists = async () => {
    if (account.address && networkCorrect) {
      console.log("loading");
      const result = await checkIfUserExists(account.address);
      console.log("loaded");
      setUserExists(result);
      console.log("result of user", result);

      if (result) {
        navigate('/sending-crpto/home-page');
      } else {
        navigate('/selection-page')
      }
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum && account.isConnected) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('chainId', chainId);
        if (parseInt(chainId, 16) === BASE_CHAIN_ID) {
          setNetworkCorrect(true);
        } else {
          setNetworkCorrect(false);
        }
      } catch (error) {
        console.error("Error checking network", error);
      }
    }
  };

  useEffect(() => {
    if (account.isConnected) {
      checkNetwork();
    }
  }, [account.chain?.id]);

  useEffect(() => {
    if (networkCorrect) {
      fetchUserExists();
    }
  }, [networkCorrect, account.address]);


  return (
    <div>
        <Routes>
          <Route path='/' element={account.isConnected && userExists === false ? <SelectionPage /> : <LandingPage />} />
          <Route path='/selection-page' element={<SelectionPage /> } />
          <Route path='/sending-crpto/home-page' element={<HomePage /> } />
          <Route path='/selection-page/real-number' element={<RealNumber />} />
          <Route path='/selection-page/virtual-number' element={<VirtualNumber />} />
          <Route path='/real-number/otp-page' element={<OtpPage />} />
          <Route path='/otp-page/number-linked' element={<Linked />} />
          <Route path='/virtual/number-linked' element={<VirtualLinked />} />
          <Route path='/virtual-number/search-results' element={<SearchResult />} />
          <Route path='/virtual-number/search-results/cart-checkout' element={<CartCheckout />} />
          <Route path='/search-results/cart-checkout/mint-number' element={<MintNumber />} />
          <Route path='/search-results/cart-checkout/purchase-successful' element={<PurchaseSuccessful />} />
          <Route path="/sending-crpto/payment-realnumber" element={<HomePage  activeTab="payments" />} />
        </Routes>
    </div>
  );
};

export default App;