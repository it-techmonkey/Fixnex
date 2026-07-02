import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  customerName: string;
  customerEmail: string;
  customerId: string;
  orderId: string;
  transactionId: string;
  amount: string;
  date: string;
  time: string;
  serviceName: string;
  status: string;
}

export const InvoiceEmail = ({
  customerName = "Valued Customer",
  customerEmail = "customer@example.com",
  customerId = "USR-000",
  orderId = "ORD-0000",
  transactionId = "TXN-0000",
  amount = "0.00",
  date = new Date().toLocaleDateString(),
  time = new Date().toLocaleTimeString(),
  serviceName = "Fixnex Service",
  status = "SUCCESS",
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Payment Receipt from Fixnex</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column style={headerLogoColumn}>
                <Heading style={headerTitle}>FIXNEX</Heading>
              </Column>
              <Column style={headerTextColumn}>
                <Text style={headerSubtitle}>RECEIPT</Text>
              </Column>
            </Row>
          </Section>
          
          <Section style={content}>
            <Text style={greeting}>Hello {customerName},</Text>
            <Text style={paragraph}>
              Thank you for choosing Fixnex! Your payment has been successfully processed. Please keep this receipt for your records.
            </Text>

            <Section style={detailsBox}>
              <Text style={boxTitle}>Customer Details</Text>
              <Row style={detailRow}>
                <Column style={detailLabel}>Name</Column>
                <Column style={detailValue}>{customerName}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Email</Column>
                <Column style={detailValue}>{customerEmail}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>User ID</Column>
                <Column style={detailValue}>{customerId}</Column>
              </Row>
            </Section>

            <Section style={receiptBox}>
              <Text style={boxTitle}>Transaction Details</Text>
              
              <Row style={receiptRow}>
                <Column style={receiptLabel}>Service / Item</Column>
                <Column style={receiptValue}>{serviceName}</Column>
              </Row>
              <Hr style={divider} />
              
              <Row style={receiptRow}>
                <Column style={receiptLabel}>Payment Status</Column>
                <Column style={receiptValue}>
                  <span style={statusBadge}>{status}</span>
                </Column>
              </Row>
              <Hr style={divider} />

              <Row style={receiptRow}>
                <Column style={receiptLabel}>Date & Time</Column>
                <Column style={receiptValue}>{date} at {time}</Column>
              </Row>
              <Hr style={divider} />
              
              <Row style={receiptRow}>
                <Column style={receiptLabel}>Order ID</Column>
                <Column style={receiptValue}>{orderId}</Column>
              </Row>
              <Hr style={divider} />
              
              <Row style={receiptRow}>
                <Column style={receiptLabel}>Transaction ID</Column>
                <Column style={receiptValue}>{transactionId}</Column>
              </Row>
              <Hr style={divider} />
              
              <Row style={receiptRowTotal}>
                <Column style={receiptLabelTotal}>Total Paid</Column>
                <Column style={receiptValueTotal}>AED {amount}</Column>
              </Row>
            </Section>

            <Text style={footer}>
              Thank you,<br />
              <strong>The Fixnex Team</strong><br/>
              Dubai, UAE
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  maxWidth: "600px",
  overflow: "hidden",
};

const header = {
  padding: "32px 48px",
  backgroundColor: "#020618",
};

const headerLogoColumn = {
  width: "50%",
};

const headerTextColumn = {
  width: "50%",
  textAlign: "right" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "800",
  margin: "0",
  letterSpacing: "1px",
};

const headerSubtitle = {
  color: "#a1a1aa",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
  letterSpacing: "2px",
};

const content = {
  padding: "40px 48px",
};

const greeting = {
  color: "#09090b",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "16px",
  marginTop: "0",
};

const paragraph = {
  color: "#52525b",
  fontSize: "15px",
  lineHeight: "24px",
  marginBottom: "32px",
};

const detailsBox = {
  backgroundColor: "#fcfcfd",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const receiptBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "32px",
};

const boxTitle = {
  color: "#09090b",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const detailRow = {
  padding: "4px 0",
};

const detailLabel = {
  color: "#71717a",
  fontSize: "14px",
  width: "120px",
};

const detailValue = {
  color: "#09090b",
  fontSize: "14px",
  fontWeight: "500",
};

const receiptRow = {
  padding: "12px 0",
};

const receiptRowTotal = {
  padding: "20px 0 0",
};

const receiptLabel = {
  color: "#71717a",
  fontSize: "14px",
  width: "140px",
};

const receiptValue = {
  color: "#09090b",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "right" as const,
};

const statusBadge = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "4px 12px",
  borderRadius: "9999px",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
};

const receiptLabelTotal = {
  color: "#09090b",
  fontSize: "16px",
  fontWeight: "700",
  width: "140px",
};

const receiptValueTotal = {
  color: "#09090b",
  fontSize: "20px",
  fontWeight: "800",
  textAlign: "right" as const,
};

const divider = {
  borderColor: "#e4e4e7",
  margin: "0",
};

const footer = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "40px",
  borderTop: "1px solid #e4e4e7",
  paddingTop: "24px",
};
