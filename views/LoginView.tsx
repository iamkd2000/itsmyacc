import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Wallet } from 'lucide-react';

interface LoginViewProps {
  onLogin: (mobile: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      // Simulate SMS
      alert(`Your OTP for My Personal Khata is 1234`);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      setLoading(true);
      setTimeout(() => {
        onLogin(mobile);
      }, 800);
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-900/50 p-3 rounded-full">
            <Wallet className="h-10 w-10 text-primary-400" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
          My Personal Khata
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Track where your money goes and who has it.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-slate-800">
          {step === 'MOBILE' ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="text-center mb-4">
                 <p className="text-sm text-slate-400">OTP sent to +91 {mobile}</p>
                 <button type="button" onClick={() => setStep('MOBILE')} className="text-primary-400 text-xs mt-1 hover:text-primary-300">Change Number</button>
              </div>
              <Input
                label="Enter OTP"
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
                autoFocus
              />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};