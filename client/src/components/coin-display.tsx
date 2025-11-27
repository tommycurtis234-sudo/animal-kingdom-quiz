import { motion } from "framer-motion";
import { Coins } from "lucide-react";

interface CoinDisplayProps {
  coins: number;
  className?: string;
}

export function CoinDisplay({ coins, className = "" }: CoinDisplayProps) {
  return (
    <motion.div
      key={coins}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 font-semibold ${className}`}
      data-testid="coin-display"
    >
      <Coins className="w-6 h-6 text-primary" aria-hidden="true" />
      <span className="text-lg" data-testid="text-coin-count">
        {coins}
      </span>
    </motion.div>
  );
}
