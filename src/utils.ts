
/**One of the users who have been input */
export type Name = string

export type Transaction = {
    paidBy: Name
    amount: number
    usedBy: Name[] 
}
