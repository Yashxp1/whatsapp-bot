'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  MessageCircle,
  Smartphone,
  CheckCircle2,
  QrCode as QrCodeIcon,
  RefreshCw,
  Loader2,
  Wifi,
} from 'lucide-react';

const socket = io('http://import.meta.env.VITE_API_URL;');

const QrCode = () => {
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState('connecting');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const statusConfig = {
    connecting: {
      title: 'Connecting to WhatsApp',
      description: 'Initializing WhatsApp Web connection...',
      icon: <Wifi className="h-6 w-6 text-blue-500 animate-pulse" />,
      badge: {
        variant: 'secondary' as const,
        text: 'Connecting',
        className: '',
      },
    },
    qr: {
      title: 'Scan QR Code',
      description: 'Open WhatsApp on your phone and scan this QR code',
      icon: <QrCodeIcon className="h-6 w-6 text-primary" />,
      badge: {
        variant: 'default' as const,
        text: 'Ready to Scan',
        className: '',
      },
    },
    ready: {
      title: 'Connected Successfully!',
      description: 'WhatsApp Web is now connected and ready to use',
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      badge: {
        variant: 'default' as const,
        text: 'Connected',
        className:
          'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
      },
    },
  };

  useEffect(() => {
    if (status === 'connecting') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    socket.on('qr', (qrString: string) => {
      setQr(qrString);
      setStatus('qr');
      setProgress(100);
    });

    socket.on('ready', () => {
      setStatus('ready');
      setProgress(100);

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    });

    return () => {
      socket.off('qr');
      socket.off('ready');
    };
  }, [navigate]);

  const handleRefresh = () => {
    setQr(null);
    setStatus('connecting');
    setProgress(0);
    socket.disconnect();
    socket.connect();
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
              <MessageCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WhatsApp Web</h1>
            <p className="text-muted-foreground">
              Connect your WhatsApp account
            </p>
          </div>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {currentStatus.icon}
              <CardTitle className="text-xl">{currentStatus.title}</CardTitle>
            </div>
            <Badge
              variant={currentStatus.badge.variant}
              className={currentStatus.badge.className || ''}
            >
              {currentStatus.badge.text}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              {currentStatus.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {status !== 'ready' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            <div className="flex justify-center">
              {status === 'connecting' && (
                <div className="w-[280px] h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-2xl bg-muted/30 space-y-4">
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating QR Code...
                  </p>
                </div>
              )}

              {status === 'qr' && qr && (
                <div className="relative">
                  <div className="p-4 bg-white dark:bg-background rounded-2xl shadow-inner border">
                    <QRCodeCanvas
                      value={qr}
                      size={280}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {status === 'ready' && (
                <div className="w-[280px] h-[280px] flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      Connection Successful!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Redirecting to Dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {status === 'qr' && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">How to scan:</span>
                </div>
                <ol className="text-sm text-muted-foreground space-y-1 ml-6 list-decimal">
                  <li>Open WhatsApp on your phone</li>
                  <li>Tap Menu (⋮) &gt; Linked Devices</li>
                  <li>Tap "Link a Device"</li>
                  <li>Point your phone at this screen</li>
                </ol>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {/* <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button> */}

              {status !== 'ready' && (
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Your messages are encrypted end-to-end and never stored on our
            servers
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrCode;
