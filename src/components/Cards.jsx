const Cards = ({ icons, text, number, color }) => {
  return (
    <div
      className={`rounded-xl shadow-lg p-5 text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icons}</div>
        <div className="text-right">
          <h4 className=" font-semibold text-center text-xl">{text}</h4>
          <p className="text-2xl font-bold">{number}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
