const Card = ({ data, headers }) => {
  return (
    <div className="grid gap-3 p-4 border border-gray-300 rounded-lg bg-gray-100 max-w-xl">
      {headers.map(({ property, title }) => (
        <div key={property} className="flex justify-between">
          <span className="font-semibold text-gray-700">{title}</span>
          <span className="text-gray-900">{String(data?.[property] ?? '—')}</span>
        </div>
      ))}
    </div>
  );
};

export default Card;