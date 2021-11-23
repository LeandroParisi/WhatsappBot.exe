export default interface Messages {
  body : string;
  isGroupMsg : boolean;
  from : string;
  sender : Sender
}

interface Sender {
  shortName : string
  name : string
}