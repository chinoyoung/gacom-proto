import V1Hero from "./V1Hero";
import V1Intro from "./V1Intro";
import V1ProgramDiscovery from "./V1ProgramDiscovery";
import V1TravelEssentials from "./V1TravelEssentials";
import V1Faq from "./V1Faq";
import V1TravelResources from "./V1TravelResources";
import V1Signup from "./V1Signup";

export default function V1MyGoAbroadPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <V1Hero />
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-12 xl:gap-24 px-4 py-12 xl:py-24 md:px-6 lg:px-8 xl:px-0">
        <V1Intro />
        <V1ProgramDiscovery />
        <V1TravelEssentials />
        <V1Faq />
      </div>
      <V1TravelResources />
      <V1Signup />
    </div>
  );
}
