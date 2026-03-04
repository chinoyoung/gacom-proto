"use client";
import AIGenerateButton from "./AIGenerateButton";

interface Step6Data {
  cost: string;
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  applyUrl: string;
  housingType: string;
  languageOfInstruction: string;
  creditsAvailable: string;
}

interface Step6PricingContactProps {
  data: Step6Data;
  onChange: (data: Partial<Step6Data>) => void;
  formData: any;
}

export default function Step6PricingContact({ data, onChange, formData }: Step6PricingContactProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Pricing &amp; Contact</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cost information, deadlines, and how prospective students can reach you.
        </p>
      </div>

      <AIGenerateButton
        step={6}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-6">
        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
            Pricing
          </h3>

          <div>
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Cost{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="cost"
              type="text"
              value={data.cost}
              onChange={(e) => onChange({ cost: e.target.value })}
              placeholder="e.g. $3,500/semester, $500/week, Contact provider"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>

          <div>
            <label
              htmlFor="applicationDeadline"
              className="block text-sm font-medium text-gray-700"
            >
              Application Deadline{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="applicationDeadline"
              type="date"
              value={data.applicationDeadline}
              onChange={(e) => onChange({ applicationDeadline: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
            Contact Information
          </h3>

          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Email{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="contactEmail"
              type="email"
              value={data.contactEmail}
              onChange={(e) => onChange({ contactEmail: e.target.value })}
              placeholder="programs@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>

          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Phone{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="contactPhone"
              type="text"
              value={data.contactPhone}
              onChange={(e) => onChange({ contactPhone: e.target.value })}
              placeholder="e.g. +1 (555) 123-4567"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>

          <div>
            <label
              htmlFor="applyUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Apply URL{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="applyUrl"
              type="url"
              value={data.applyUrl}
              onChange={(e) => onChange({ applyUrl: e.target.value })}
              placeholder="https://example.com/apply"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
            Additional Details
          </h3>

          <div>
            <label
              htmlFor="housingType"
              className="block text-sm font-medium text-gray-700"
            >
              Housing Type{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="housingType"
              type="text"
              value={data.housingType}
              onChange={(e) => onChange({ housingType: e.target.value })}
              placeholder="e.g. Shared apartment, University dorm, Host family"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>

          <div>
            <label
              htmlFor="languageOfInstruction"
              className="block text-sm font-medium text-gray-700"
            >
              Language of Instruction{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="languageOfInstruction"
              type="text"
              value={data.languageOfInstruction}
              onChange={(e) => onChange({ languageOfInstruction: e.target.value })}
              placeholder="e.g. English, Italian, Bilingual"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>

          <div>
            <label
              htmlFor="creditsAvailable"
              className="block text-sm font-medium text-gray-700"
            >
              Credits Available{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="creditsAvailable"
              type="text"
              value={data.creditsAvailable}
              onChange={(e) => onChange({ creditsAvailable: e.target.value })}
              placeholder="e.g. 12-18 semester credits, 6 ECTS"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
