export const getCardCount = (value: string) => {
    if (value === 'JACK' || value === 'KING' || value === 'QUEEN' || value === '10') return 10
    if (value === 'ACE') return 11
    return +(value)
}