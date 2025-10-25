import DarkVeil from "@/components/DarkVeil";
import RecipePage from "@/components/recıpepage";

export default function Home() {

  return (
  
      <div className="relative min-h-screen">
        <div className="fixed inset-0 ">
          <DarkVeil hueShift={210} speed={2} />
        </div>
        <RecipePage />
      </div>
  
  );
}
