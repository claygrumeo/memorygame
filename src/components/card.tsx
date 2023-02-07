import "./card.css";
import { CardType } from "./gameWrapper";

export default function Card({
  card,
  showBack,
  toggleCard,
  revealState,
}: {
  card: CardType;
  showBack: boolean;
  toggleCard: (selection: CardType) => void;
  revealState: {[key: string]: boolean}
}) {
  return (
    <div className="card" onClick={() => toggleCard(card)}>
      {!showBack && <img className="cardImage" src={card.url} alt="card" />}
      {showBack && <div className={`pattern-checks-sm bg-blue white cardBackground ${revealState[card.id] ? "selected" : ""}`} />}
    </div>
  );
}
