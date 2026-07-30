import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-slate-950 py-24 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;