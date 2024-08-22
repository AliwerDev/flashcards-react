export interface ICard {
  _id: string;
  userId: string;
  front: string;
  back: string;
  boxId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICardPlayData {
  cardId: string;
  correct: boolean;
}
