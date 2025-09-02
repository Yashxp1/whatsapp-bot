import { Route, Routes } from 'react-router-dom';
import QrCode from './components/QrCode';
import Home from './components/Home';

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<QrCode />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
