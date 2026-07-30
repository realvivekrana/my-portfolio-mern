import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (
      !form.from_name.trim() ||
      !form.from_email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_5ek5x96",
        "template_vm2hpon",
        {
          from_name: form.from_name,
          from_email: form.from_email,
          subject: form.subject,
          message: form.message,
        },
        "iO03STzf4wGjZ_XQQ"
      );

      toast.success("Message sent successfully!");

      setForm({
        from_name: "",
        from_email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendEmail}
      className="space-y-5 rounded-2xl bg-slate-900 p-8 shadow-lg"
    >
      <input
        type="text"
        name="from_name"
        placeholder="Your Name"
        value={form.from_name}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
      />

      <input
        type="email"
        name="from_email"
        placeholder="Your Email"
        value={form.from_email}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
      />

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
      />

      <textarea
        rows={6}
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-cyan-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;