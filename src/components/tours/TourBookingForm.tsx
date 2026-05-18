"use client";

import { useState } from "react";
import { Alert, Button, ConfigProvider, DatePicker, Form, Input, InputNumber } from "antd";

type TourBookingFormProps = {
  tourSlug: string;
  tourTitle: string;
  onSuccess?: () => void;
};

type BookingFormValues = {
  name: string;
  email?: string;
  whatsapp?: string;
  travelDate?: string;
  travelers?: number;
  pickupLocation?: string;
  message?: string;
};

export function TourBookingForm({
  tourSlug,
  tourTitle,
  onSuccess,
}: TourBookingFormProps) {
  const [form] = Form.useForm<BookingFormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [travelDate, setTravelDate] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: BookingFormValues) {
    setStatus("idle");
    setErrorMessage(null);

    const email = values.email?.trim();
    const whatsapp = values.whatsapp?.trim();

    if (!email && !whatsapp) {
      form.setFields([
        {
          name: "whatsapp",
          errors: ["Add WhatsApp or email so we can reply."],
        },
      ]);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tour-booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          tourTitle,
          name: values.name.trim(),
          email: email || null,
          whatsapp: whatsapp || null,
          travelDate: travelDate || null,
          travelers: values.travelers ?? 1,
          pickupLocation: values.pickupLocation?.trim() || null,
          message: values.message?.trim() || null,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setErrorMessage(body?.error || "Unable to send request. Please try again.");
        return;
      }

      form.resetFields();
      setTravelDate(undefined);
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send request. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ConfigProvider theme={{ token: { borderRadius: 16, colorPrimary: "#F5B700", colorPrimaryHover: "#D99A00", colorSuccess: "#B45309", colorInfo: "#D99A00", colorBorder: "#d8cdbb", controlHeightLG: 46, fontFamily: "inherit" } }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        initialValues={{ travelers: 2 }}
        className="tour-booking-form"
      >
      <div className="mb-5 rounded-2xl border bg-secondary p-4">
        <p className="text-sm font-semibold text-foreground">{tourTitle}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Send your preferred date, traveler count, and pickup details. This is
          an availability request, not a payment.
        </p>
      </div>

      {status === "success" ? (
        <Alert
          type="success"
          showIcon
          className="mb-4"
          message="Request sent"
          description="We received your direct booking request and will reply with availability."
        />
      ) : null}
      {status === "error" ? (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message="Request failed"
          description={errorMessage}
        />
      ) : null}

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Enter your name." }]}
      >
        <Input size="large" autoComplete="name" placeholder="Your name" />
      </Form.Item>

      <div className="grid gap-0 sm:grid-cols-2 sm:gap-3">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Enter a valid email address." }]}
      >
          <Input size="large" autoComplete="email" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item label="WhatsApp" name="whatsapp">
          <Input size="large" autoComplete="tel" placeholder="+971..." />
        </Form.Item>
      </div>

      <div className="grid gap-0 sm:grid-cols-2 sm:gap-3">
        <Form.Item label="Travel date" name="travelDate">
          <DatePicker
            className="w-full"
            size="large"
            onChange={(_, dateString) =>
              setTravelDate(Array.isArray(dateString) ? dateString[0] : dateString)
            }
          />
        </Form.Item>
        <Form.Item
          label="Travelers"
          name="travelers"
          rules={[
            {
              type: "number",
              min: 1,
              message: "Travelers must be at least 1.",
            },
          ]}
        >
          <InputNumber className="w-full" size="large" min={1} max={99} />
        </Form.Item>
      </div>

      <Form.Item label="Pickup location" name="pickupLocation">
        <Input size="large" placeholder="Hotel, airport, or neighborhood" />
      </Form.Item>

      <Form.Item label="Message" name="message">
        <Input.TextArea
          rows={4}
          placeholder="Share your route preferences, family needs, or timing."
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={isSubmitting}
        className="!h-11 !rounded-full !bg-primary !font-semibold !text-primary-foreground !shadow-none hover:!bg-primary-hover"
      >
        Send direct booking request
      </Button>
      </Form>
    </ConfigProvider>
  );
}
