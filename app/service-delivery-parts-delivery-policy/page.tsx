import type { Metadata } from "next";
import LegalPolicyPage from "../components/legal/LegalPolicyPage";
import { legalPolicies } from "../legal-policies";

const policy = legalPolicies["service-delivery-parts-delivery-policy"];

export const metadata: Metadata = {
  title: policy.title,
  description: policy.description,
  alternates: {
    canonical: `/${policy.slug}`,
  },
};

export default function ServiceDeliveryPartsDeliveryPolicyPage() {
  return <LegalPolicyPage policy={policy} />;
}
