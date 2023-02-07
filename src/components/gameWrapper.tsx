import "./gameWrapper.css";
import Card from "./card";
import _, { map, random } from "underscore";
import { useEffect, useState } from "react";

export interface CardType {
  id: string;
  url: string;
}

export default function GameWrapper() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [revealState, setRevealState] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<CardType[]>([]);
  const [canSelect, setCanSelect] = useState<boolean>(true);
  const [win, setWin] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);

  /*
    Initial useEffect sets up the images and cards as well
    as the inital state of what's been revealed.  It also preloads the images
    so that there isn't lag when you first click on them.
  */
  useEffect(() => {
    // get 8 random numbers (x2 each)
    let randomsList: number[] = [];
    for (let i = 0; i < 8; i++) {
      const rand = _.random(1, 75);
      if (!randomsList.includes(rand)) {
        randomsList.push(rand);
      } else {
        i -= 1;
      }
    }
    randomsList = _.shuffle([...randomsList, ...randomsList]);

    let cardsList: CardType[] = [];
    randomsList.forEach((rand, i) => {
      const newCard: CardType = {
        id: `${i}`,
        url: `https://picsum.photos/id/${rand}/150`,
      };
      cardsList.push(newCard);
    });

    const loadImages = async (cards: CardType[]) => {
      const promises = cards.map((card) => {
        return new Promise<string>(async (resolve, reject) => {
          const resp = await fetch(card.url);
          const url = resp.url;
          const newImage = new Image();
          newImage.src = url;
          resolve(url);
        });
      });

      await Promise.all(promises).then((data) => {
        setLoading(false);
        data.forEach((url, i) => {
          cardsList[i].url = url;
        });
      });
    };

    loadImages(cardsList).then(() => setLoading(false));

    setCards(cardsList);

    const newRevealState: { [key: number]: boolean } = {};
    for (let i = 0; i < cards.length; i++) {
      newRevealState[`${i}`] = false;
    }

    setRevealState(newRevealState);
    setReset(false)
    setWin(false)
  }, [reset]);

  /*
    This useEffect runs when new cards have been selected.  If 2 cards
    have been selected, they're compared.  If they're a match, they stay face
    up.  If they're not a match, they get automatically turned back over.
  */
  useEffect(() => {
    if (selected.length == 2) {
      setCanSelect(false);
      if (selected[0].url !== selected[1].url) {
        setTimeout(() => {
          const newRevealState = { ...revealState };
          newRevealState[selected[0].id] = false;
          newRevealState[selected[1].id] = false;
          setRevealState(newRevealState);
          setSelected([]);
          setCanSelect(true);
        }, 900);
      } else {
        setSelected([]);
        setCanSelect(true);
        checkForWin();
      }
    }
  }, [selected]);

  // Runs when selecting a card
  function toggleCard(card: CardType): void {
    if (!revealState[card.id] && canSelect) {
      const newRevealState = { ...revealState };
      newRevealState[card.id] = !newRevealState[card.id];
      if (newRevealState[card.id]) {
        const newSelected = [...selected, card];
        setSelected(newSelected);
      }
      setRevealState(newRevealState);
    }
  }

  function checkForWin(): void {
    if (
      _.every(_.values(revealState), (v) => {
        return v === true;
      })
    ) {
      setWin(true);
    }
  }

  return (
    <div className="gameWrapper">
      <div className="statusHeader">{win ? <h1>You Win!</h1> : <h1></h1>}</div>
      {loading && <div className="lds-dual-ring"></div>}
      <div className="gameBoard">
        {!loading &&
          cards.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                showBack={!revealState[i]}
                toggleCard={toggleCard}
                revealState={revealState}
              />
            );
          })}
      </div>
      {win && <button className="resetButton" onClick={() => setReset(true)}>Play Again</button>}
    </div>
  );
}
