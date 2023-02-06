import "./gameWrapper.css";
import Card from "./card";
import _, { map } from "underscore";
import { useEffect, useState } from "react";

export default function GameWrapper() {
  const [cards, setCards] = useState<number[]>([]);
  const [revealState, setRevealState] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let numList: number[] = [];
    for (let i = 0; i < 8; i++) {
      const rand = _.random(1, 100);
      if (!numList.includes(rand)) {
        numList.push(rand);
      } else {
        i -= 1;
      }
    }

    const loadImage = (image: string) => {
      console.log("IMAGE", image)
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image;
        resolve(image)
      });
    };

    Promise.all(
      numList.map((image) => loadImage(`https://picsum.photos/id/${image}/150`))
    ).then(() => {
      console.log("TEST?")
      setLoading(false)
    });

    numList = [...numList, ...numList];
    numList = _.shuffle(numList);

    setCards(numList);

    let newRevealState: { [key: number]: boolean } = {};
    for (let i = 0; i < numList.length; i++) {
      newRevealState[i] = false;
    }

    setRevealState(newRevealState);
  }, []);

  function toggleCard(i: number): void {
    const newRevealState = { ...revealState };
    newRevealState[i] = !newRevealState[i];
    setRevealState(newRevealState);
  }

  return (
    <div className="gameWrapper">
      {!loading && cards.map((card, i) => {
        return (
          <Card
            key={i}
            index={i}
            image={`https://picsum.photos/id/${card}/150/`}
            showBack={!revealState[i]}
            toggleCard={toggleCard}
          />
        );
      })}
      {loading && <h1>test</h1>}
    </div>
  );
}
