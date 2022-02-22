import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {getCardCount} from './utils/utils';
import {Button, ButtonGroup, Paper} from '@mui/material';

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
            console.log(response)
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
            setCount(count + getCardCount(response.data.cards[0].value))
            console.log(response.data.cards[0].value)
            setCard(newCard)
            setCards([...cards, newCard])
        } catch (e) {
            alert(e)
        }
    }

    const clearField = () => {
        setCards([])
        setCount(0)
    }
    // Components before rendering
    const componentCards = cards.map((c, i) =>
        <img src={c} alt="card" height="180px" width="110px" key={i}/>)
    const componentResult = (count < 21) ? count : (count === 21) ? 'BLACKJACK' : 'BOR'

    return (
        <div className={'app'}>
            {/*<div className={'field'}>*/}
            {/*    <Paper className={'block'}>*/}
            {/*        {componentCards}*/}
            {/*    </Paper>*/}
            {/*    <ButtonGroup variant="contained" fullWidth>*/}
            {/*        <Button onClick={() => getCard(deckID)}>Еще</Button>*/}
            {/*        <Button onClick={() => clearField()}>Сброс</Button>*/}
            {/*        <Button>Three</Button>*/}
            {/*    </ButtonGroup>*/}
            {/*    <div className={'count'}>*/}
            {/*        {componentResult}*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={'block block--small'}>
                <div className={'button'} onClick={() => getCard(deckID)}>hit</div>
                <div className={'button'} onClick={() => clearField()}>clear</div>
            </div>
            <div className={'block block--large'}>
                <div className={'field'}>

                </div>
                <div className={'field'}>
                    {componentCards}
                </div>
            </div>
            <div className={'block block--small'}>
                <div className={'info'}>
                    <div>0</div>
                    <span>Dealer</span>
                </div>
                <div className={'button'}>stand</div>
                <div className={'info'}>
                    <div>0</div>
                    <span>Player</span>
                </div>
            </div>
        </div>
    );
};

export default App;