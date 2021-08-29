export interface IMessage {
  id: string;
  content: string;
  from: IUser;
}

export interface IUser{
  id: string;
  name: string;
}