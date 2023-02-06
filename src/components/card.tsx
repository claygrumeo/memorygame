import "./card.css";

export default function Card({
  index,
  image,
  showBack,
  toggleCard,
}: {
  index: number;
  image: string;
  showBack: boolean;
  toggleCard: (selection: number) => void;
}) {
  return (
    <div className="card" onClick={() => toggleCard(index)}>
      {!showBack && <img className="cardImage" src={image} alt="card" />}
      {showBack && <div className="cardBackground" />}
    </div>
  );
}
