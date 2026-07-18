interface StatBarProps {
     label: string;
     value: number;
     color: string;
}

export default function StatBar({label, value, color}: StatBarProps) {
     return (
          <div >
               <div className="flex justify-between text-xs text-gray-500 mb-1">`
                    <span>{label}</span>
                    <span>{value}</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-500`}
                    style= {{ width: `${value}%` }}/>
               </div>                   
          </div>               
     );

}