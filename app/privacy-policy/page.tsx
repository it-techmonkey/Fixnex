import type { Metadata } from "next";
import LegalPolicyPage from "../components/legal/LegalPolicyPage";
import { legalPolicies } from "../legal-policies";

const policy = legalPolicies["privacy-policy"];

export const metadata: Metadata = {
  title: policy.title,
  description: policy.description,
  alternates: {
    canonical: `/${policy.slug}`,
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPolicyPage policy={policy} />;
}
