import V1Hero from "./V1Hero";
import V1InPageNav from "./V1InPageNav";
import V1Intro from "./V1Intro";
import V1ProgramDiscovery from "./V1ProgramDiscovery";
import V1TravelEssentials from "./V1TravelEssentials";
import V1Faq from "./V1Faq";
import V1TravelResources from "./V1TravelResources";
import V1Signup from "./V1Signup";

export default function V1MyGoAbroadPage() {
  return (
    <div className="w-full">
      <V1Hero />
      <V1InPageNav />
      <V1Intro />
      <V1ProgramDiscovery />
      <V1TravelEssentials />
      <V1Faq />
      <V1TravelResources />
      <V1Signup />
    </div>
  );
}
