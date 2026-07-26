interface StatChipProps {
     label: string;
     value: number;
     color: string;
}

export default function StatChip({ label, value, color }: StatChipProps) {
     return (
          <div className="flex flex-col items-center gap-1">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${color}`}>
                    {Math.round(value)}
               </div>
               <span className="text-[10px] text-gray-500">{label}</span>
          </div>
     );
}
