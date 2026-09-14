"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [btnText, setBtnText] = useState("SUBMIT");
  const [status, setStatus] = useState("idle");
  const [note, setNote] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.subject || !form.message) {
      setNote("Please fill in all required fields.");
      return;
    }

    setStatus("loading");
    setBtnText("SUBMITTING...");
    setNote("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("success");
        setBtnText("SUBMITTED!");
        setNote("Message sent successfully!");
        setForm({ fullname: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setBtnText("SUBMIT");
          setStatus("idle");
        }, 3000);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setStatus("idle");
      setBtnText("SUBMIT");
      setNote("Failed to send the message, please try again.");
    }
  };

  return (
    <form className="wow fadeInUp" onSubmit={submit} data-wow-delay="0.2s">
      <div className="row">
        <div className="form-group col-md-12 mb-4">
          <input
            type="text"
            name="fullname"
            className="form-control"
            placeholder="Full Name *"
            value={form.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-12 mb-4">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-12 mb-4">
          <input
            type="text"
            name="subject"
            className="form-control"
            placeholder="Subject *"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-12 mb-5">
          <textarea
            name="message"
            className="form-control"
            rows="4"
            placeholder="Message *"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="col-md-12">
          <p className="dp-required-note">* Indicates required field</p>
          {note ? <p className="dp-form-note">{note}</p> : null}
          <button type="submit" className="btn-default" disabled={status === "loading"}>
            {btnText}
          </button>
        </div>
      </div>
    </form>
  );
}
