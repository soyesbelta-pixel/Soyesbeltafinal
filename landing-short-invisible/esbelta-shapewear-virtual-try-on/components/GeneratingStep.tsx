
import React from 'react';
import { Spinner } from './Spinner';

interface GeneratingStepProps {
  productName: string;
}

const generatingMessages = [
  "Applying our seamless technology...",
  "Tailoring the perfect fit...",
  "Accentuating your natural curves...",
  "Crafting your confident look...",
  "Rendering front and side views...",
  "Almost there, the results will be amazing!"
];

export const GeneratingStep: React.FC<GeneratingStepProps> = ({ productName }) => {
  const [message, setMessage] = React.useState(generatingMessages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % generatingMessages.length;
      setMessage(generatingMessages[index]);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Generating Your Try-On</h2>
      <p className="text-gray-600 mb-8">
        Our AI is now fitting the <span className="font-semibold text-pink-600">{productName}</span> on your photo.
      </p>
      <div className="flex justify-center items-center flex-col space-y-6">
        <Spinner size="lg" />
        <p className="text-gray-500 animate-pulse transition-all duration-500">{message}</p>
      </div>
    </div>
  );
};
