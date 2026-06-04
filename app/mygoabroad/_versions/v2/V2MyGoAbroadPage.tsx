import V2Hero from "./V2Hero";
import V2Intro from "./V2Intro";
import V2ProgramDiscovery from "./V2ProgramDiscovery";
import V2TravelEssentials from "./V2TravelEssentials";
import V2Faq from "./V2Faq";
import V2TravelResources from "./V2TravelResources";
import V2Signup from "./V2Signup";

export default function V2MyGoAbroadPage() {
  return (
    <div className="w-full">
      <V2Hero />
      <V2Intro />
      <V2ProgramDiscovery />
      <V2TravelEssentials />
      <V2Faq />
      <V2TravelResources />
      <V2Signup />
    </div>
  );
}
