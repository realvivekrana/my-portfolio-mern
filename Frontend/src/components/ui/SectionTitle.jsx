function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-bold text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;