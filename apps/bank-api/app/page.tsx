
import { Landing } from "./components/landing"
import { Suspense } from "react";
export default function Home() {
  return (
   <div>
    <Suspense>
     <Landing></Landing>
    </Suspense>  
   </div>
  );
}
