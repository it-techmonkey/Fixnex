import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export const PasswordResetEmail = ({
  name = "there",
  resetUrl = "https://www.fixnex.ae/reset-password?token=example",
  expiresInMinutes = 30,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Fixnex password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>FIXNEX</Heading>
        </Section>
        <Section style={content}>
          <Text style={greeting}>Hello {name},</Text>
          <Text style={paragraph}>
            We received a request to reset the password for your Fixnex account. Click the button
            below to choose a new password. The link works once and expires in {expiresInMinutes} minutes.
          </Text>
          <Section style={buttonWrap}>
            <Button href={resetUrl} style={button}>
              Reset password
            </Button>
          </Section>
          <Text style={small}>
            If the button does not work, copy this link into your browser:
            <br />
            {resetUrl}
          </Text>
          <Text style={small}>
            If you did not ask for this, you can ignore this email. Your password will not change.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  borderRadius: "12px",
  maxWidth: "600px",
  overflow: "hidden" as const,
};
const header = { padding: "28px 40px", backgroundColor: "#020618" };
const headerTitle = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: "800",
  margin: "0",
  letterSpacing: "1px",
};
const content = { padding: "32px 40px" };
const greeting = { fontSize: "18px", fontWeight: "600", color: "#09090b", margin: "0 0 12px" };
const paragraph = { fontSize: "15px", lineHeight: "24px", color: "#52525b", margin: "0 0 24px" };
const buttonWrap = { textAlign: "center" as const, margin: "0 0 24px" };
const button = {
  backgroundColor: "#0284c7",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 28px",
  borderRadius: "8px",
  textDecoration: "none",
};
const small = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#71717a",
  margin: "0 0 12px",
  wordBreak: "break-all" as const,
};
