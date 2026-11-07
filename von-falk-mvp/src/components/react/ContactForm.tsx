import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "success" | "error" | "draft";
type FieldKey = "name" | "email" | "phone" | "subject" | "about";
type Fields = Record<FieldKey, string>;

const CONTACT_ENDPOINT = import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined;
const EMAIL = "info@vonfalk.nl";
const initial: Fields = { name: "", email: "", phone: "", subject: "", about: "" };

function emailDraft(fields: Fields): string {
  const subject = "Project enquiry: " + fields.subject;
  const body = [
    "Name: " + fields.name,
    "Email: " + fields.email,
    "Phone: " + fields.phone,
    "",
    "About the project:",
    fields.about,
  ].join("\n");
  return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [draft, setDraft] = useState("");

  function update(key: FieldKey) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setFields((old) => ({ ...old, [key]: value }));
      setStatus((old) => old === "error" || old === "draft" ? "idle" : old);
      setErrors((old) => ({ ...old, [key]: undefined }));
    };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setErrors({});
    if (!CONTACT_ENDPOINT) {
      const href = emailDraft(fields);
      setDraft(href);
      setStatus("draft");
      // A static site has no submission backend. Let the visitor send the enquiry
      // from their own email client; never claim it was delivered automatically.
      window.location.assign(href);
      return;
    }

    setStatus("sending");
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Contact submission failed");
      const data: { ok?: boolean; errors?: Partial<Record<FieldKey, string>> } =
        await response.json().catch(() => ({}));
      if (data.ok === false) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p role="status" className="vf-form-message">Thank you. Your enquiry has been received.</p>;
  }

  const disabled = status === "sending";
  const entries: { key: FieldKey; label: string; type?: string; placeholder: string }[] = [
    { key: "name", label: "01. Name.", placeholder: "Name." },
    { key: "email", label: "02. E-mail.", type: "email", placeholder: "E-mail." },
    { key: "phone", label: "03. Phone.", type: "tel", placeholder: "Phone." },
    { key: "subject", label: "04. Subject.", placeholder: "Subject." },
  ];

  return (
    <form className="vf-form" onSubmit={submit} aria-label="Project enquiry" noValidate={false}>
      <FieldGroup>
        {entries.map(({ key, label, type, placeholder }) => (
          <Field key={key} className="vf-form-field" data-invalid={Boolean(errors[key]) || undefined}>
            <FieldLabel htmlFor={"contact-" + key}>{label}</FieldLabel>
            <Input
              id={"contact-" + key}
              name={key}
              type={type ?? "text"}
              placeholder={placeholder}
              autoComplete={key === "name" ? "name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"}
              required
              maxLength={256}
              value={fields[key]}
              onChange={update(key)}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? "error-" + key : undefined}
            />
            {errors[key] && <p id={"error-" + key} role="alert">{errors[key]}</p>}
          </Field>
        ))}
        <Field className="vf-form-field" data-invalid={Boolean(errors.about) || undefined}>
          <FieldLabel htmlFor="contact-about">05. About the project.</FieldLabel>
          <Textarea
            id="contact-about"
            name="about"
            placeholder="About the project."
            required
            maxLength={5000}
            value={fields.about}
            onChange={update("about")}
            aria-invalid={Boolean(errors.about)}
            aria-describedby={errors.about ? "error-about" : undefined}
          />
          {errors.about && <p id="error-about" role="alert">{errors.about}</p>}
        </Field>
        {status === "error" && <p className="vf-form-message" role="alert">We could not send your enquiry. Please try again.</p>}
        {status === "draft" && (
          <p className="vf-form-message" role="status">
            Your email application should open with the enquiry filled in. Please send it from there.
            {" "}<a href={draft} style={{ textDecoration: "underline" }}>Open email draft again</a>.
          </p>
        )}
        {!CONTACT_ENDPOINT && <p id="contact-email-note" className="sr-only">Preparing an email opens your email application. No enquiry is sent until you send it yourself.</p>}
        <Button className="vf-submit" type="submit" disabled={disabled} aria-describedby={!CONTACT_ENDPOINT ? "contact-email-note" : undefined}>
          {disabled ? "Sending…" : CONTACT_ENDPOINT ? "Submit" : "Prepare email"}
        </Button>
      </FieldGroup>
    </form>
  );
}
