'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5001');

const QrCode = () => {
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState('Waiting for QR...');

  const navigate = useNavigate()

  useEffect(() => {

    socket.on('qr', (qrString: string) => {
      setQr(qrString);
      setStatus('Scan this QR in WhatsApp');
    });

    socket.on('ready', () => {
      setStatus('WhatsApp is connected ✅');
      navigate("/home");

    });

    return () => {
      socket.off('qr');
      socket.off('ready');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center gap-6 w-[320px]">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {status}
        </h2>

        {qr ? (
          <div className="p-4 bg-gray-100 rounded-xl">
            <QRCodeCanvas value={qr} size={220} />
          </div>
        ) : (
          <div className="w-[220px] h-[220px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
            Loading QR...
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCode;
