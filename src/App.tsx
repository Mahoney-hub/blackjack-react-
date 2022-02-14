import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {getCardCount} from './utils/utils';

interface IImages {
    png: string
    svg: string
}

interface ICard {
    code: string
    image: string
    images: IImages
    suit: string
    value: string
}

interface ICardObj {
    cards: ICard[]
    deck_id: string
    remaining: number
    success: boolean
}

interface IDeck {
    success: boolean
    deck_id: string
    shuffled: boolean
    remaining: boolean
}

const App = () => {
    // BLL Card
    const [card, setCard] = useState<string | undefined>(undefined) // текущая карта
    const [cards, setCards] = useState<string[]>([]) // массив карт на поле
    const [count, setCount] = useState<number>(0) // счет
    // BLL Deck
    const [cardBalance, setCardBalance] = useState<number>(52) // остаток карт в колоде
    const [deckID, setDeckID] = useState<string>('') // id колоды карт для api
    useEffect(() => {
        getDeck()
    }, [])

    // Functions
    // Перемешать и получить карты
    async function getDeck() {
        try {
            const response = await axios.get<IDeck>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            console.log(response.data)
            setCardBalance(+(response.data.remaining))
            setDeckID(response.data.deck_id)
        } catch (e) {
            alert(e)
        }
    }

    // Нарисовать карту
    async function getCard(id: string) {
        const queryString = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`
        try {
            const response = await axios.get<ICardObj>(queryString)
            console.log(response.data)
            const newCard: string = response.data.cards[0].images.png
            setCount(getCardCount(response.data.cards[0].value))
            console.log(response.data.cards[0].value)
            setCard(newCard)
            setCards([...cards, newCard])
        } catch (e) {
            alert(e)
        }
    }

    const clearField = () => {
        setCards([])
    }
    // Components before rendering
    const componentCards = cards.map((c, i) => {
            return (
                <img src={c} alt="card" key={i}/>
            )
        }
    )
    return (
        <div className={'app'}>
            <div>
                {componentCards}
            </div>
            <div>
                <button onClick={() => getCard(deckID)}>click</button>
            </div>
            <div>
                <button onClick={() => clearField()}>clear</button>
            </div>
        </div>
    );
};

export default App;