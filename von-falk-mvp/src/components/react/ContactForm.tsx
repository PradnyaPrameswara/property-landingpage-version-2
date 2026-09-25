import { useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "success" | "error";

const CONTACT_ENDPOINT = "/_actions/contact"; // TODO(deploy): provide Astro Action backend; static build has no server.

const initialFields: Record<string, string> = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  about: "",
};

export default function ContactForm() {
  const [fields, setFields] = useState<Record<string, string>>(initialFields);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(key: string) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFields((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: "POST", body: formData });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json().catch(() => ({}));
      if (data && data.ok === false) {
        setFieldErrors(data.errors ?? {});
        setStatus("error");
      } else setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p>Thank you for the inquiry, it has been submitted successfully. We will get back to you shortly.</p>;
  }

  const sending = status === "sending";

  return (
    <div>
      {status === "error" && (
        <p role="alert">Something went wrong while submitting the form. Please try again.</p>
      )}
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Field data-invalid={Boolean(fieldErrors.name) || undefined}>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
              id="contact-name"
              name="name"
              placeholder="Name."
              required
              maxLength={256}
              value={fields.name}
              onChange={update("name")}
              aria-invalid={Boolean(fieldErrors.name)}
              data-invalid={Boolean(fieldErrors.name) || undefined}
            />
            {fieldErrors.name && <FieldDescription>{fieldErrors.name}</FieldDescription>}
          </Field>
          <Field data-invalid={Boolean(fieldErrors.email) || undefined}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="E-mail."
              required
              maxLength={256}
              value={fields.email}
              onChange={update("email")}
              aria-invalid={Boolean(fieldErrors.email)}
              data-invalid={Boolean(fieldErrors.email) || undefined}
            />
            {fieldErrors.email && <FieldDescription>{fieldErrors.email}</FieldDescription>}
          </Field>
          <Field data-invalid={Boolean(fieldErrors.phone) || undefined}>
            <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="Phone"
              required
              maxLength={256}
              value={fields.phone}
              onChange={update("phone")}
              aria-invalid={Boolean(fieldErrors.phone)}
              data-invalid={Boolean(fieldErrors.phone) || undefined}
            />
            {fieldErrors.phone && <FieldDescription>{fieldErrors.phone}</FieldDescription>}
          </Field>
          <Field data-invalid={Boolean(fieldErrors.subject) || undefined}>
            <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
            <Input
              id="contact-subject"
              name="subject"
              placeholder="Subject"
              required
              maxLength={256}
              value={fields.subject}
              onChange={update("subject")}
              aria-invalid={Boolean(fieldErrors.subject)}
              data-invalid={Boolean(fieldErrors.subject) || undefined}
            />
            {fieldErrors.subject && <FieldDescription>{fieldErrors.subject}</FieldDescription>}
          </Field>
          <Field data-invalid={Boolean(fieldErrors.about) || undefined}>
            <FieldLabel htmlFor="contact-about">About</FieldLabel>
            <Textarea
              id="contact-about"
              name="about"
              placeholder="About the project."
              required
              maxLength={5000}
              value={fields.about}
              onChange={update("about")}
              aria-invalid={Boolean(fieldErrors.about)}
              data-invalid={Boolean(fieldErrors.about) || undefined}
            />
            {fieldErrors.about && <FieldDescription>{fieldErrors.about}</FieldDescription>}
          </Field>
          <Button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Submit"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
